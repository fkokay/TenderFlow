using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.Models
{
    public class TenderCapexModel
    {
        public int Id { get; set; }
        public int TenderId { get; set; }
        public string AssetCode  { get; set; }
        public int Quantity { get; set; } = 0;
        public string Unit { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
