namespace TenderFlow.Services
{
    using Microsoft.EntityFrameworkCore;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Text.Json;
    using TenderFlow.Core.Domain.Entities;
    using TenderFlow.Data;

    public class RagService
    {
        private readonly TenderFlowContext _db;
        private readonly IHttpClientFactory _httpFactory;
        private readonly string _geminiApiKey;
        private readonly string _embeddingModel;
        private readonly string _chatModel;
        private readonly string _netsisConnectionString;

        public RagService(
               TenderFlowContext db,
               IHttpClientFactory httpFactory,
               IConfiguration config)
        {
            _db = db;
            _httpFactory = httpFactory;
            _geminiApiKey = config["Gemini:ApiKey"] ?? throw new Exception("Gemini ApiKey yok");
            _embeddingModel = config["Gemini:EmbeddingModel"] ?? "models/text-embedding-004";
            _chatModel = config["Gemini:ChatModel"] ?? "models/gemini-1.5-flash";
        }

        private HttpClient Client => _httpFactory.CreateClient();

        #region Embedding Oluşturma



        private async Task<float[]> CreateEmbeddingAsync(string text)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/{_embeddingModel}:embedContent?key={_geminiApiKey}";

            var requestObj = new
            {
                model = "models/text-embedding-004",
                content = new
                {
                    parts = new[]
                    {
                        new { text = text }
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestObj);

            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var resp = await Client.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            resp.EnsureSuccessStatusCode();

            using var doc = JsonDocument.Parse(body);

            var vector = doc.RootElement
                .GetProperty("embedding")
                .GetProperty("values")
                .EnumerateArray()
                .Select(x => x.GetSingle())
                .ToArray();

            return vector;
        }

        #endregion

        #region Index – TenderFlow

        public async Task IndexTendersAsync(int take = 200)
        {
            var tenders = await _db.Tenders
                .OrderBy(x => x.Id)
                .Take(take)
                .ToListAsync();

            foreach (var t in tenders)
            {
                var content = TenderTextBuilder.BuildTenderText(t);
                var emb = await CreateEmbeddingAsync(content);
                var json = JsonSerializer.Serialize(emb);

                var entity = new AiEmbedding
                {
                    SourceSystem = "TenderFlow",
                    SourceTable = "Tender",
                    SourceKey = t.Id.ToString(),
                    Content = content,
                    VectorJson = json,
                    CreatedAt = DateTime.UtcNow
                };

                _db.AiEmbeddings.Add(entity);
            }

            await _db.SaveChangesAsync();
        }

        #endregion

        #region Soru Cevaplama
        public async Task<string> AskAsync(string question, int topK = 10)
        {
            // 1) Soruyu embedding’e çevir
            var qEmb = await CreateEmbeddingAsync(question);

            // 2) Son embedding’lerden bir subset al (performans için)
            var all = await _db.AiEmbeddings
                .OrderByDescending(x => x.CreatedAt)
                .Take(3000)
                .ToListAsync();

            var scored = all
                .Select(e =>
                {
                    var vec = JsonSerializer.Deserialize<float[]>(e.VectorJson) ?? Array.Empty<float>();
                    var score = CosineSimilarity(qEmb, vec);
                    return new { e.Content, e.SourceSystem, e.SourceTable, e.SourceKey, Score = score };
                })
                .OrderByDescending(x => x.Score)
                .Take(topK)
                .ToList();

            var contextBlocks = scored
                .Select(s => $"[{s.SourceSystem}/{s.SourceTable}/{s.SourceKey}]\n{s.Content}")
                .ToList();

            var context = string.Join("\n-----------------------\n", contextBlocks);

            // 3) Gemini'den cevap iste
            var answer = await GenerateAnswerAsync(context, question);
            return answer;
        }

        private static float CosineSimilarity(float[] a, float[] b)
        {
            int len = Math.Min(a.Length, b.Length);
            double dot = 0, na = 0, nb = 0;
            for (int i = 0; i < len; i++)
            {
                dot += a[i] * b[i];
                na += a[i] * a[i];
                nb += b[i] * b[i];
            }
            if (na == 0 || nb == 0) return 0;
            return (float)(dot / (Math.Sqrt(na) * Math.Sqrt(nb)));
        }

        private async Task<string> GenerateAnswerAsync(string context, string question)
        {
            var url = $"https://generativelanguage.googleapis.com/v1/{_chatModel}:generateContent?key={_geminiApiKey}";

            var prompt = $@"
Aşağıda ERP sistemlerinden (TenderFlow ihaleleri ve Netsis stok/cari/hareket) alınmış veriler var.

Bu verileri kullanarak soruyu düzgün ve ayrıntılı şekilde cevapla.
Veri dışında tahmin yürütme, uydurma bilgi verme.

VERİ:
{context}

SORU:
{question}
";

            var reqObj = new
            {
                contents = new[]
                {
                new {
                    parts = new[] {
                        new { text = prompt }
                    }
                }
            }
            };

            var json = JsonSerializer.Serialize(reqObj);

            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var resp = await Client.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            resp.EnsureSuccessStatusCode();

            using var doc = JsonDocument.Parse(body);

            var answer = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return answer ?? "";
        }

        #endregion
    }
}
