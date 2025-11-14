using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderRequiredDocument")]
    public class TenderRequiredDocument : BaseEntity
    {
        public int TenderId { get; set; }
        public int DocumentId { get; set; }
        public bool IsMandatory { get; set; }
        public bool Submitted { get; set; }
        public DateTime? SubmissionDate { get; set; }

        public Tender Tender { get; set; }
        public TenderDocument Document { get; set; }
        public ICollection<TenderDocumentFile> Files { get; set; }
    }
}
