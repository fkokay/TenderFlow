namespace TenderFlow.Models
{
    public class TenderDeviceModel
    {
        public int Id { get; set; }
        public int TenderId { get; set; }
        public string SupplyType { get; set; }
        public string StockCode { get; set; }
        public int Quantity { get; set; }
        public string CustomerCode { get; set; }
        public string Currency { get; set; }
        public decimal RentUnitPrice { get; set; }
        public decimal ServiceUnitPrice { get; set; }
        public decimal LinkUnitPrice { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
