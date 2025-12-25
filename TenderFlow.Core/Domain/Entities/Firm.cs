using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Firm")]
    public class Firm : BaseEntity
    {
        public string FirmCode { get; set; } = string.Empty;
        public string FirmName { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
        public string RegisterNumber { get; set; } = string.Empty;
        public string NetsisRestApiUrl { get; set; } = string.Empty;
        public string NetsisDbServer { get; set; } = string.Empty;
        public string NetsisDbName { get; set; } = string.Empty;
        public string NetsisDbUser { get; set; } = string.Empty;
        public string NetsisDbPassword { get; set; } = string.Empty;
        public string NetsisApplicationName { get; set; } = string.Empty;

        public string NetsisUser { get; set; } = string.Empty;
        public string NetsisPassword { get; set; } = string.Empty;
        public int NetsisCompanyCode { get; set; } = 1;
        public int NetsisBranchCode { get; set; } = 0;
        public string EIRSSeri { get; set; } = string.Empty;
        public string EFATSeri { get; set; } = string.Empty;
        public string EARSSeri { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public ICollection<Tender> Tenders { get; set; } = new List<Tender>();
        public ICollection<Guarantee> Guarantees { get; set; } = new List<Guarantee>();
    }
}
