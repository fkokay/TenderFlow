using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderDevice")]
    public class TenderDevice : BaseEntity
    {
        public int TenderId { get; set; }
        public string SupplyType { get; set; }
        public string StockCode { get; set; }
        public int Quantity { get; set; }
        public string CustomerCode { get; set; }
        public string Currency { get; set; }
        public decimal RentUnitPrice { get; set; }
        public decimal ServiceUnitPrice { get; set; }
        public decimal LinkUnitPrice { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime CreatedAt { get; set; }

        public Tender Tender { get; set; }
        public ICollection<Asset> Assets { get; set; }
        public ICollection<DeviceServiceRecord> ServiceRecords { get; set; }
        public ICollection<TenderDeviceService> Services { get; set; }
    }
}
