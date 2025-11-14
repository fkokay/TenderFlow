using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("MaintenancePlan")]
    public class MaintenancePlan : BaseEntity
    {
        public int AssetId { get; set; }
        public string PlanName { get; set; }
        public string MaintenanceType { get; set; }
        public int IntervalDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime NextDueDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public Asset Asset { get; set; }
    }
}
