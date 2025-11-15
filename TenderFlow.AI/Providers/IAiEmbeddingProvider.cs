using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.AI.Providers
{
    public interface IAiEmbeddingProvider
    {
        string Model { get; }
        string ProviderName { get; }

        Task<float[]> EmbedAsync(string text, CancellationToken ct = default);
    }
}
