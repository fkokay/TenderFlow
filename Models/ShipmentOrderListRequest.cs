using TenderFlow.Core.Grid;

namespace TenderFlow.Models
{
    public class OrderListRequest
    {
        public required GridCommand Grid { get; set; }
        public required ShipmentFilter Filters { get; set; }
    }

    public class ShipmentFilter
    {
        public string OrderNo { get; set; }
        public string Cari { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Depo { get; set; } = string.Empty;
        public bool HasBalance { get; set; } = false;
    }
}
