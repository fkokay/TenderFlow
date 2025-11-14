namespace TenderFlow.Models
{
    public class TenderModel
    {
        public int Id { get; set; }
        public int FirmId { get; set; }
        public string FirmName { get; set; }
        public string TenderCode { get; set; }
        public string TenderName { get; set; }
        public string PublicAuthorityCode { get; set; }
        public string PublicAuthorityName { get; set; }
        public string TenderType { get; set; }
        public string TenderMethod { get; set; }
        public DateTime TenderStartDate { get; set; }
        public DateTime TenderEndDate { get; set; }
        public DateTime? TenderDueDate { get; set; }
        public decimal TenderQuantity { get; set; }
        public decimal TenderAmount { get; set; }
        public string Currency { get; set; }
        public int? TemporaryGuaranteeRateId { get; set; }
        public string TemporaryGuaranteeSubject { get; set; }
        public int? FinalGuaranteeRateId { get; set; }
        public string? FinalGuaranteeSubject { get; set; }
        public DateTime AnnouncementDate { get; set; }
        public string TenderStatus { get; set; }
        public DateTime? DocumentUploadDate { get; set; }
        public DateTime? ContractDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
