using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.Models
{
    public class TenderReaktifModel
    {
        public int Id { get; set; }

        public int TenderId { get; set; }

        public string StockCode { get; set; } = string.Empty;

        public string SutCode { get; set; } = string.Empty;

        public string? TestName { get; set; }

        public decimal TestCount { get; set; } = 0m;

        public decimal SutPoint { get; set; } = 0m;

        public decimal TotalSutPoint { get; set; } = 0m;

        public string Currency { get; set; } = "TRY";

        public decimal UnitPrice { get; set; } = 0m;

    }
}
