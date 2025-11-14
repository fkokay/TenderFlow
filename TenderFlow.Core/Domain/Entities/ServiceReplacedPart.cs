using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("ServiceReplacedPart")]
    public class ServiceReplacedPart : BaseEntity
    {
        public int ServiceRecordId { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public int? Quantity { get; set; }
        public string Currency { get; set; }
        public bool? IsWarranty { get; set; }
        public DateTime? CreatedAt { get; set; }

        public DeviceServiceRecord ServiceRecord { get; set; }
    }
}
