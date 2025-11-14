using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Asset")]
    public class Asset :BaseEntity
    {
        public int? TenderId { get; set; }
        public int? DeviceId { get; set; }
        public string AssetCode { get; set; }
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
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }

        public Tender Tender { get; set; }
        public TenderDevice Device { get; set; }
        public ICollection<MaintenancePlan> MaintenancePlans { get; set; }
    }
}
