using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Models;

namespace TenderFlow.AI.Providers
{
    public interface IAiProvider
    {
        AiProviderKind Kind { get; }
        Task<AiResponse> GenerateAsync(AiRequest request, CancellationToken cancellationToken = default);
    }
}
