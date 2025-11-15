using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TenderFlow.AI.Embedding;

namespace TenderFlow.AI.Providers
{
    public class OpenAiEmbeddingProvider : IAiEmbeddingProvider
    {
        private readonly HttpClient _client;
        public string Model { get; }
        public string ProviderName => "OpenAI";

        public OpenAiEmbeddingProvider(IHttpClientFactory factory, IConfiguration config)
        {
            _client = factory.CreateClient("OpenAI");

            var apiKey = config["OpenAI:ApiKey"]
                ?? throw new Exception("OpenAI ApiKey eksik.");

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            Model = config["OpenAI:EmbeddingModel"] ?? "text-embedding-3-large";
        }

        public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
        {
            string url = "https://api.openai.com/v1/embeddings";
            var body = new
            {
                input = text,
                model = Model
            };

            var json = JsonSerializer.Serialize(body);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(req, ct);

            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync(ct);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);

            var raw = doc.RootElement
                .GetProperty("data")[0]
                .GetProperty("embedding")
                .EnumerateArray()
                .Select(x => (float)x.GetDouble())
                .ToArray();

            return EmbeddingNormalizer.Normalize(raw);
        }
    }
}
