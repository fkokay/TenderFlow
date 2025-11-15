using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Models;
using TenderFlow.AI.Providers;

namespace TenderFlow.AI.Orchestration
{
    public interface IAiOrchestrator
    {
        Task<AiResponse> GenerateAsync(AiRequest request, CancellationToken ct = default);
    }

    public class AiOrchestrator : IAiOrchestrator
    {
        private readonly IEnumerable<IAiProvider> _providers;

        public AiOrchestrator(IEnumerable<IAiProvider> providers)
        {
            _providers = providers;
        }

        public async Task<AiResponse> GenerateAsync(AiRequest request, CancellationToken ct = default)
        {
            var provider = SelectProvider(request);

            return await provider.GenerateAsync(request, ct);
        }

        private IAiProvider SelectProvider(AiRequest request)
        {
            if (request.Provider == AiProviderKind.OpenAI)
                return _providers.First(p => p.Kind == AiProviderKind.OpenAI);

            if (request.Provider == AiProviderKind.Gemini)
                return _providers.First(p => p.Kind == AiProviderKind.Gemini);

            var prompt = request.Prompt ?? string.Empty;
            var type = request.Type?.ToLowerInvariant() ?? string.Empty;

            if (type == "code" ||
                prompt.Contains("c# ", StringComparison.OrdinalIgnoreCase) ||
                prompt.Contains("sql ", StringComparison.OrdinalIgnoreCase) ||
                prompt.Contains("tsql", StringComparison.OrdinalIgnoreCase))
            {
                return _providers.First(p => p.Kind == AiProviderKind.Gemini);
            }

            if (prompt.Length > 4000 || type == "long_context")
            {
                return _providers.First(p => p.Kind == AiProviderKind.Gemini);
            }

            return _providers.First(p => p.Kind == AiProviderKind.Gemini);
        }
    }
}
