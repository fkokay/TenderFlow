using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Tender")]
    public class Tender : BaseEntity
    {
        public int FirmId { get; set; }
        public string TenderCode { get; set; }
        public string TenderName { get; set; }
        public string PublicAuthorityCode { get; set; }
        public string TenderType { get; set; }
        public string TenderMethod { get; set; }
        public DateTime TenderStartDate { get; set; }
        public DateTime TenderEndDate { get; set; }
        public DateTime? TenderDueDate { get; set; }
        public decimal TenderQuantity { get; set; }
        public decimal TenderAmount { get; set; }
        public string Currency { get; set; }
        public int? TemporaryGuaranteeRateId { get; set; }
        public int? FinalGuaranteeRateId { get; set; }
        public DateTime AnnouncementDate { get; set; }
        public string TenderStatus { get; set; }
        public DateTime? DocumentUploadDate { get; set; }
        public DateTime? ContractDate { get; set; }
        public DateTime CreatedAt { get; set; }

        public Firm Firm { get; set; }
        public Guarantee TemporaryGuarantee { get; set; }
        public Guarantee FinalGuarantee { get; set; }

        public ICollection<Asset> Assets { get; set; }
        public ICollection<TenderDevice> Devices { get; set; }
        public ICollection<TenderCapex> Capex { get; set; }
        public ICollection<TenderOpex> Opex { get; set; }
        public ICollection<TenderReaktif> Reaktifs { get; set; }
        public ICollection<TenderRequiredDocument> RequiredDocuments { get; set; }
        public ICollection<TenderExternalQuality> ExternalQualities { get; set; }
    }
}
