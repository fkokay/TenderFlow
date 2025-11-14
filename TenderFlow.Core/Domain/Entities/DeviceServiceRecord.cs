using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("DeviceServiceRecord")]
    public class DeviceServiceRecord : BaseEntity
    {
        public int DeviceId { get; set; }
        public DateTime ServiceDate { get; set; }
        public string ServiceType { get; set; }
        public string ProblemDescription { get; set; }
        public string SolutionDescription { get; set; }
        public string TechnicianName { get; set; }
        public decimal? ServiceDurationHours { get; set; }
        public decimal? DowntimeHours { get; set; }
        public DateTime CreatedAt { get; set; }

        public TenderDevice Device { get; set; }
        public ICollection<ServiceReplacedPart> ReplacedParts { get; set; }
    }
}
