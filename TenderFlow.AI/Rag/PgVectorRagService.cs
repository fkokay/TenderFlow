using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Embedding;
using Pgvector;

namespace TenderFlow.AI.Rag
{
    public class PgVectorRagService
    {
        private readonly string _connectionString;
        private readonly IEmbeddingSelector _selector;

        public PgVectorRagService(IConfiguration config, IEmbeddingSelector selector)
        {
            _connectionString = config.GetConnectionString("PgVector")?? throw new Exception("PgVector connection string yok.");
            _selector = selector;

        }

        public async Task InsertAsync(string sourceSystem, string sourceTable, string sourceKey, string content, CancellationToken ct = default)
        {
            // 1) AI embedding provider seç
            var provider = _selector.Select(content);

            // 2) Embedding üret
            float[] embedding = await provider.EmbedAsync(content, ct);

            // 3) PostgreSQL'e INSERT
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(_connectionString);
            dataSourceBuilder.UseVector();
            await using var dataSource = dataSourceBuilder.Build();
            var con = await dataSource.OpenConnectionAsync(ct);

            var sql = @"
            INSERT INTO ai_embedding
            (source_system, source_table, source_key, content, embedding)
            VALUES (@sys, @table, @key, @content, @embedding);
        ";

            await using var cmd = new NpgsqlCommand(sql, con);

            cmd.Parameters.AddWithValue("sys", sourceSystem);
            cmd.Parameters.AddWithValue("table", sourceTable);
            cmd.Parameters.AddWithValue("key", sourceKey);
            cmd.Parameters.AddWithValue("content", content);
            cmd.Parameters.AddWithValue("embedding", new Vector(embedding));

            await cmd.ExecuteNonQueryAsync(ct);
        }

        public async Task<IReadOnlyList<RagDocumentChunk>> SearchAsync(string query, int topK = 5, CancellationToken ct = default)
        {
            // 1) Query için embedding üret
            var provider = _selector.Select(query);
            float[] queryEmbed = await provider.EmbedAsync(query, ct);

            // 2) PostgreSQL üzerinde vektör araması yap
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(_connectionString);
            dataSourceBuilder.UseVector();
            await using var dataSource = dataSourceBuilder.Build();
            var con = await dataSource.OpenConnectionAsync(ct);

            await using (var check = new NpgsqlCommand("SELECT COUNT(*) FROM public.ai_embedding", con))
            {
                var c = (long)await check.ExecuteScalarAsync();
                Console.WriteLine("ROW COUNT IN C#: " + c);
            }

            const string sql = @"
        SELECT
            id,
            source_system,
            source_table,
            source_key,
            content,
            embedding,
            created_at,
            (embedding <=> @query) AS distance
        FROM public.ai_embedding
        ORDER BY embedding <=> @query
        LIMIT @k;
    ";

            await using var cmd = new NpgsqlCommand(sql, con);

            // ---- Vector parametresi ----
            var param = new NpgsqlParameter<Vector>("query", new Vector(queryEmbed))
            {
                DataTypeName = "vector"
            };
            cmd.Parameters.Add(param);

            // limit parametresi
            cmd.Parameters.AddWithValue("k", topK);


            Console.WriteLine("SQL:");
            Console.WriteLine(cmd.CommandText);

            Console.WriteLine("Params:");
            foreach (NpgsqlParameter p in cmd.Parameters)
            {
                Console.WriteLine($"{p.ParameterName} ({p.DataTypeName}) = {p.Value}");
            }

            await using var reader = await cmd.ExecuteReaderAsync(ct);

            var list = new List<RagDocumentChunk>();

            while (await reader.ReadAsync(ct))
            {
                var vec = (Vector)reader[5];

                list.Add(new RagDocumentChunk
                {
                    Id = reader.GetInt32(0),
                    SourceSystem = reader.GetString(1),
                    SourceTable = reader.GetString(2),
                    SourceKey = reader.GetString(3),
                    Content = reader.GetString(4),
                    Embedding = vec.ToArray(),
                    CreatedAt = reader.GetDateTime(6),
                    Distance = reader.GetDouble(7)
                });
            }

            return list;
        }

    }
}
