using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderReaktifStatistics")]
    public class TenderReaktifStatistics : BaseEntity   
    {
        public int TenderTestId { get; set; }
        public int TestCount { get; set; }
        public decimal SutPoint { get; set; }
        public decimal TotalSutPoint { get; set; }

        public TenderReaktif TenderReaktif { get; set; }
    }
}
