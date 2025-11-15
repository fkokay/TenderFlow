using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TenderFlow.AI.Models;

namespace TenderFlow.AI.Providers
{
    public class GeminiProvider : IAiProvider
    {
        private readonly HttpClient _client;
        private readonly string _model;
        private readonly string _apiKey;
        public AiProviderKind Kind => AiProviderKind.Gemini;

        public GeminiProvider(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _client = httpFactory.CreateClient("Gemini");
            _apiKey = config["Gemini:ApiKey"] ?? throw new Exception("Gemini:ApiKey tanımlı değil.");
            _model = config["Gemini:ChatModel"] ?? "models/gemini-2.5-flash";
        }


        public async Task<AiResponse> GenerateAsync(AiRequest request, CancellationToken cancellationToken = default)
        {
            var url = $"https://generativelanguage.googleapis.com/v1/{_model}:generateContent?key={_apiKey}";

            var body = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = request.Prompt }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(body);
            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();

            using var stream = await res.Content.ReadAsStreamAsync(cancellationToken);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

            var root = doc.RootElement;
            var text = root
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? string.Empty;

            return new AiResponse
            {
                Provider = AiProviderKind.Gemini,
                Model = _model,
                Content = text
            };
        }
    }
}
