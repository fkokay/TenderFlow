using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderExternalQuality")]
    public class TenderExternalQuality : BaseEntity
    {
        public int TenderId { get; set; }
        public string FirmName { get; set; }
        public int? ProgramCount { get; set; }
        public decimal? UnitPrice { get; set; }
        public string Currency { get; set; }
        public DateTime CreatedAt { get; set; }

        public Tender Tender { get; set; }
    }
}
