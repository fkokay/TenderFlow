using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderReaktif")]
    public class TenderReaktif : BaseEntity
    {
        public int TenderId { get; set; }
        public string StockCode { get; set; }
        public string SutCode { get; set; }
        public string TestName { get; set; }
        public decimal TestCount { get; set; }
        public decimal SutPoint { get; set; }
        public decimal TotalSutPoint { get; set; }
        public string Currency { get; set; }
        public decimal UnitPrice { get; set; }

        public Tender Tender { get; set; }
        public ICollection<TenderReaktifStatistics> Statistics { get; set; }
    }
}
