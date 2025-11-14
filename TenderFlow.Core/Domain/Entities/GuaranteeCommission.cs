using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{

    [Table("GuaranteeCommission")]
    public class GuaranteeCommission : BaseEntity
    {
        public int GuaranteeId { get; set; }
        public DateTime CommissionStartDate { get; set; }
        public DateTime CommissionEndDate { get; set; }
        public decimal CommissionRate { get; set; }         
        public decimal CommissionAmount { get; set; } 
        public string Currency { get; set; } = "TRY"; 
        public string PaymentStatus { get; set; } = "Beklemede"; // Beklemede / Ödendi / İptal
        public DateTime? PaymentDate { get; set; }
        public string? BankReferenceNo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public string? Note { get; set; }

        public virtual Guarantee Guarantee { get; set; }
    }
}
