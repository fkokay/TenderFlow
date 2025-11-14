using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderDocumentFile")]
    public class TenderDocumentFile : BaseEntity
    {
        public int TenderRequiredDocumentId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public int? FileSize { get; set; }
        public byte[] FileContent { get; set; }
        public DateTime UploadedAt { get; set; }

        public TenderRequiredDocument RequiredDocument { get; set; }
    }
}
