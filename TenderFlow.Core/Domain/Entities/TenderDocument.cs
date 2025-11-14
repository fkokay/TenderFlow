using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderDocument")]
    public class TenderDocument : BaseEntity
    {
        public string DocumentName { get; set; }
        public string Description { get; set; }

        public ICollection<TenderRequiredDocument> RequiredDocuments { get; set; }
    }
}
