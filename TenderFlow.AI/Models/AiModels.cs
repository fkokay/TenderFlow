using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Rag;

namespace TenderFlow.AI.Models
{
    public enum AiProviderKind
    {
        Auto = 0,
        OpenAI = 1,
        Gemini = 2
    }

    public class AiRequest
    {
        public string Prompt { get; set; } = default!;
        public string? Type { get; set; }
        public string? UserId { get; set; }
        public AiProviderKind Provider { get; set; } = AiProviderKind.Auto;
    }

    public class AiResponse
    {
        public string Content { get; set; } = default!;
        public AiProviderKind Provider { get; set; }
        public string Model { get; set; } = default!;
        public double? PromptTokens { get; set; }
        public double? CompletionTokens { get; set; }
        public double? CostUsd { get; set; }

        public List<RagDocumentChunk> Sources { get; set; } = new();
    }
}
