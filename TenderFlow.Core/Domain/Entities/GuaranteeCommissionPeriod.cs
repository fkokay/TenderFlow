using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("GuaranteeCommissionPeriod")]
    public class GuaranteeCommissionPeriod : BaseEntity
    {
        public string PeriodName { get; set; }
        public int Period { get; set; }

        public ICollection<Guarantee> Guarantees { get; set; }
    }
}
