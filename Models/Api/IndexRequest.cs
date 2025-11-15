namespace TenderFlow.Models.Api
{
    public class IndexRequest
    {
        public string? SourceSystem { get; set; }
        public string? SourceTable { get; set; }
        public string? SourceKey { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
