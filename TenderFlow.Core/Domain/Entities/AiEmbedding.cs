using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("AiEmbedding")]
    public class AiEmbedding : BaseEntity
    {
        public string SourceSystem { get; set; } = null!;
        public string SourceTable { get; set; } = null!;
        public string SourceKey { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string VectorJson { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
