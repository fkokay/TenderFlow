namespace TenderFlow.AI.Models
{
    public class TenderModel
    {
        public int Id { get; set; }
        public int FirmId { get; set; }
        public string FirmName { get; set; } = string.Empty;
        public string TenderCode { get; set; } = string.Empty;
        public string TenderName { get; set; } = string.Empty;
        public string PublicAuthorityCode { get; set; } = string.Empty;
        public string PublicAuthorityName { get; set; } = string.Empty;
        public string TenderType { get; set; } = string.Empty;
        public string TenderMethod { get; set; } = string.Empty;
        public DateTime TenderStartDate { get; set; }
        public DateTime TenderEndDate { get; set; }
        public DateTime? TenderDueDate { get; set; }
        public decimal TenderQuantity { get; set; }
        public decimal TenderAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public int? TemporaryGuaranteeRateId { get; set; }
        public string TemporaryGuaranteeSubject { get; set; } = string.Empty;
        public int? FinalGuaranteeRateId { get; set; }
        public string? FinalGuaranteeSubject { get; set; }
        public DateTime AnnouncementDate { get; set; }
        public string TenderStatus { get; set; } = string.Empty;
        public DateTime? DocumentUploadDate { get; set; }
        public DateTime? ContractDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
