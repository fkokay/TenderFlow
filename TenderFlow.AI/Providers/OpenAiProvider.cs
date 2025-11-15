using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TenderFlow.AI.Models;

namespace TenderFlow.AI.Providers
{
    public class OpenAiProvider : IAiProvider
    {
        private readonly HttpClient _client;
        private readonly string _model;

        public AiProviderKind Kind => AiProviderKind.OpenAI;

        public OpenAiProvider(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _client = httpFactory.CreateClient("OpenAI");
            var apiKey = config["OpenAI:ApiKey"]
                         ?? throw new Exception("OpenAI:ApiKey tanımlı değil.");

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            _model = config["OpenAI:ChatModel"] ?? "gpt-4o-mini";
        }

        public async Task<AiResponse> GenerateAsync(AiRequest request, CancellationToken cancellationToken = default)
        {
            var body = new
            {
                model = _model,
                messages = new[]
           {
                new { role = "user", content = request.Prompt }
            }
            };

            var json = JsonSerializer.Serialize(body);
            using var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var res = await _client.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                content,
                cancellationToken);

            res.EnsureSuccessStatusCode();

            using var stream = await res.Content.ReadAsStreamAsync(cancellationToken);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

            var root = doc.RootElement;
            var text = root
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? string.Empty;

            double? promptTokens = null;
            double? completionTokens = null;

            if (root.TryGetProperty("usage", out var usage))
            {
                if (usage.TryGetProperty("prompt_tokens", out var p))
                    promptTokens = p.GetDouble();
                if (usage.TryGetProperty("completion_tokens", out var c))
                    completionTokens = c.GetDouble();
            }

            return new AiResponse
            {
                Provider = AiProviderKind.OpenAI,
                Model = _model,
                Content = text,
                PromptTokens = promptTokens,
                CompletionTokens = completionTokens
            };
        }
    }
}
