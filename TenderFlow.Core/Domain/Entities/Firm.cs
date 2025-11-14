using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Firm")]
    public class Firm : BaseEntity
    {
        public string FirmCode { get; set; }
        public string FirmName { get; set; }
        public string TaxNumber { get; set; }
        public string RegisterNumber { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Tender> Tenders { get; set; }
        public ICollection<Guarantee> Guarantees { get; set; }
    }
}
