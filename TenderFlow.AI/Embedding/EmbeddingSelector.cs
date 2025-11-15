using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Providers;

namespace TenderFlow.AI.Embedding
{
    public interface IEmbeddingSelector
    {
        IAiEmbeddingProvider Select(string text);
    }

    public class EmbeddingSelector : IEmbeddingSelector
    {
        private readonly IEnumerable<IAiEmbeddingProvider> _providers;

        public EmbeddingSelector(IEnumerable<IAiEmbeddingProvider> providers)
        {
            _providers = providers;
        }

        public IAiEmbeddingProvider Select(string text)
        {
            // Uzun metinler: Gemini tercih et
            if (text.Length > 800)
                return _providers.First(p => p.ProviderName == "Gemini");

            // Kısa metin, kod, teknik: OpenAI tercih et
            return _providers.First(p => p.ProviderName == "Gemini");
        }
    }
}