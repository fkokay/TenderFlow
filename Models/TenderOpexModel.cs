using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.Models
{
    public class TenderOpexModel
    {
        public int Id { get; set; }
        public int TenderId { get; set; }
        public string StockCode { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public decimal UnitPrice { get; set; }
        public string Currency { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
