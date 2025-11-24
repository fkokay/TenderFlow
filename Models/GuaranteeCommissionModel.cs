namespace TenderFlow.Models
{
    public class GuaranteeCommissionModel
    {
        public int Id { get; set; } 
        public int GuaranteeId { get; set; }
        public DateTime CommissionStartDate { get; set; }
        public DateTime CommissionEndDate { get; set; }
        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }
        public string Currency { get; set; } = "TRY";
        public string PaymentStatus { get; set; } = "Beklemede";
        public DateTime? PaymentDate { get; set; }
        public string? BankReferenceNo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public string? Note { get; set; }
    }
}
