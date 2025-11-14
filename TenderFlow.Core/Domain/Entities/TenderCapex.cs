using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderCapex")]
    public class TenderCapex :BaseEntity
    {
        public int TenderId { get; set; }
        public string AssetCode { get; set; }
        public int? Quantity { get; set; }
        public string Unit { get; set; }
        public DateTime CreatedAt { get; set; }

        public Tender Tender { get; set; }
    }
}
