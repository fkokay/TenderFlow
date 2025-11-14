using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Guarantee")]
    public class Guarantee : BaseEntity
    {
        public int FirmId { get; set; }
        public string Subject { get; set; }
        public string GuaranteeType { get; set; }
        public string GuaranteeForm { get; set; }
        public string GuaranteeNumber { get; set; }
        public decimal GuaranteeAmount { get; set; }
        public string Currency { get; set; }
        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }
        public int CommissionPeriodId { get; set; }
        public DateTime GuaranteeDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string BankCode { get; set; }
        public string BankBranchCode { get; set; }
        public string PublicAuthorityCode { get; set; }
        public string TakasbankReferenceNo { get; set; }
        public DateTime CreatedAt { get; set; }

        public Firm Firm { get; set; }
        public GuaranteeCommissionPeriod CommissionPeriod { get; set; }

        public ICollection<Tender> FinalGuaranteeTenders { get; set; }
        public ICollection<Tender> TemporaryGuaranteeTenders { get; set; }
    }
}
