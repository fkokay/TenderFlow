namespace TenderFlow.Models
{
    public class GuaranteeModel
    {
        public int Id { get; set; }
        public int FirmId { get; set; }
        public string FirmName { get; set; }
        public string Subject { get; set; }
        public string GuaranteeType { get; set; }
        public string GuaranteeForm { get; set; }
        public string GuaranteeNumber { get; set; }
        public decimal GuaranteeAmount { get; set; }
        public string Currency { get; set; }
        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }
        public int CommissionPeriodId { get; set; }
        public string GuaranteeCommissionPeriodName { get; set; }
        public DateTime GuaranteeDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string BankCode { get; set; }
        public string BankName { get; set; }
        public string BankBranchCode { get; set; }
        public  string BankBranchName { get; set; }
        public string PublicAuthorityCode { get; set; }
        public string PublicAuthorityName { get; set; }
        public string TakasbankReferenceNo { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
