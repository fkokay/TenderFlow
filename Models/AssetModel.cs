namespace TenderFlow.Models
{
    public class AssetModel
    {
        public int Id { get; set; }
        public int? TenderId { get; set; }
        public string? TenderCode { get; set; }
        public string? TenderName { get; set; }
        public int? DeviceId { get; set; }
        public string AssetCode { get; set; }
        public string? AssetName { get; set; }
        public string? AssetType { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string SerialNumber { get; set; }
        public DateTime InstallationDate { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public bool HasMaintenancePlan { get; set; }
        public int? MaintenancePeriodDays { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
        public string? NetsisStockCode { get; set; }
        public string? NetsisTransactionRef { get; set; }
        public bool IsFromNetsis { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
