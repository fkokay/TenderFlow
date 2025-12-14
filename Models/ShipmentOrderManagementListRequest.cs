using TenderFlow.Core.Grid;

namespace TenderFlow.Models
{
    public class ShipmentOrderManagementListRequest
    {
        public required GridCommand Grid { get; set; }
        public required ShipmentManagementFilter Filters { get; set; }
    }

    public class ShipmentManagementFilter
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Status { get; set; }
        public bool ShowCompleted { get; set; }
        public bool HighlightZeroPrice { get; set; }
    }
}
