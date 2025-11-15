using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TenderFlow.AI.Embedding;

namespace TenderFlow.AI.Providers
{
    public class GeminiEmbeddingProvider : IAiEmbeddingProvider
    {
        private readonly HttpClient _client;
        public string Model { get; }
        public string ApiKey { get; }
        public string ProviderName => "Gemini";

        public GeminiEmbeddingProvider(IHttpClientFactory factory, IConfiguration config)
        {
            _client = factory.CreateClient("Gemini");

            ApiKey = config["Gemini:ApiKey"] ?? throw new Exception("Gemini ApiKey eksik.");
            Model = config["Gemini:EmbeddingModel"] ?? "models/text-embedding-004";
        }

        public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/{Model}:embedContent?key={ApiKey}";

            var body = new
            {
                model = Model,
                content = new
                {
                    parts = new[]
                    {
                        new { text = text }
                    }
                }
            };

            var json = JsonSerializer.Serialize(body);

            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(req, ct);

            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync(ct);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);

            var raw = doc.RootElement
                .GetProperty("embedding")
                .GetProperty("values")
                .EnumerateArray()
                .Select(x => (float)x.GetDouble())
                .ToArray();

            return EmbeddingNormalizer.Normalize(raw);
        }
    }
}
