using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Models;

namespace TenderFlow.AI.Rag
{
    public class RagDocumentChunk
    {
        public int Id { get; set; }
        public string SourceSystem { get; set; } = default!;
        public string SourceTable { get; set; } = default!;
        public string SourceKey { get; set; } = default!;
        public string Content { get; set; } = default!;
        public float[] Embedding { get; set; } = Array.Empty<float>();
        public DateTime CreatedAt { get; set; }
        public double Distance { get; set; }
    }

    public interface IRagService
    {
        Task IndexTendersAsync();
        Task<AiResponse> AskAsync(string question);
    }
}
