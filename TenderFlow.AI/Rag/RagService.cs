using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Builders;
using TenderFlow.AI.Embedding;
using TenderFlow.AI.Models;
using TenderFlow.AI.Orchestration;
using TenderFlow.Data;

namespace TenderFlow.AI.Rag
{
    public class RagService : IRagService
    {
        private readonly TenderFlowContext _db;
        private readonly PgVectorRagService _pg;
        private readonly IAiOrchestrator _llm;

        public RagService(
            TenderFlowContext db,
            PgVectorRagService pg,
            IAiOrchestrator llm)
        {
            _db = db;
            _pg = pg;
            _llm = llm;
        }

        public async Task IndexTendersAsync()
        {
            // 1. Tüm ihaleleri çek
            var tenders = await _db.Tenders
                .Include(x => x.FinalGuarantee)
                .AsNoTracking()
                .ToListAsync();

            foreach (var tender in tenders)
            {
                try
                {
                    // 2. İhale metnini oluştur
                    string text = TenderTextBuilder.BuildTenderText(tender);

                    // 3. IndexTextAsync ile embedding + pgvector kaydı
                    await _pg.InsertAsync(
                        sourceSystem: "TenderFlow",
                        sourceTable: "Tender",
                        sourceKey: tender.Id.ToString(),
                        content: text
                    );
                }
                catch (Exception ex)
                {
                    // Burada log eklenebilir
                    Console.WriteLine($"Tender {tender.Id} indexlenirken hata: {ex.Message}");
                }
            }
        }

        public async Task<AiResponse> AskAsync(string question)
        {
            // 1) RAG search (daha geniş alıyoruz)
            var rawChunks = await _pg.SearchAsync(question, topK: 40);
            DateTime now = DateTime.UtcNow;

            // 2) Reranking (similarity + recency)
            var ranked = rawChunks
                .Select(c =>
                {
                    double simScore = 1.0 - c.Distance;    // distance küçük -> iyi
                    double days = (now - c.CreatedAt.ToUniversalTime()).TotalDays;
                    double recencyBoost = Math.Exp(-days / 30.0); // 0–1 arası

                    double finalScore = simScore * 0.85 + recencyBoost * 0.15;
                    return new { Chunk = c, Score = finalScore };
                })
                .OrderByDescending(x => x.Score)
                .Take(8)
                .Select(x => x.Chunk)
                .ToList();

            // 3) Daha temiz context formatı
            string context = string.Join(
                "\n\n---\n\n",
                ranked.Select(c =>
                    $"[Kaynak: {c.SourceSystem}.{c.SourceTable} | Key: {c.SourceKey} | Tarih: {c.CreatedAt:yyyy-MM-dd}]\n{c.Content}"
                )
            );

            // 4) SystemPrompt yerine bütün kuralları tek Prompt içine gömüyoruz
            string prompt = $@"
                Sen TenderFlow ve Netsis ERP konusunda uzman bir asistansın.

                Görev kuralların:
                - SADECE aşağıda verilen 'VERİ' içindeki bilgilere dayanarak cevap ver.
                - Veri yoksa 'Bu bilgi elimde yok' de.
                - Tahmin yapma, uydurma bilgi verme.
                - Netsis veya TenderFlow ile ilgili spesifik SQL gerekiyorsa SQL öner ama veri üretme.

                SORU:
                {question}

                VERİ (RAG ile alınan en alakalı kayıtlar):
                {context}
            ";

            // 5) LLM çağrısı
            var result = await _llm.GenerateAsync(new AiRequest
            {
                Prompt = prompt,
                Provider = AiProviderKind.Auto
            });

            // 6) Kullanılan kaynakları ekle
            result.Sources = ranked;

            return result;
        }
    }
}
