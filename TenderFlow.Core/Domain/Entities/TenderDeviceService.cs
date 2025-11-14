using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderDeviceService")]
    public class TenderDeviceService : BaseEntity
    {
        public int DeviceId { get; set; }
        public string ServiceType { get; set; }
        public int Year { get; set; }
        public int DeviceCount { get; set; }
        public int? MonthCount { get; set; }
        public DateTime CreatedAt { get; set; }

        public TenderDevice Device { get; set; }
    }
}
