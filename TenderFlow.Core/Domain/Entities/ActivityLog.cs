using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("ActivityLog")]
    public class ActivityLog : BaseEntity
    {
        [StringLength(50)]
        public string ActivityLogType { get; set; } = string.Empty;
        public int? UserId { get; set; }
        [Required, MaxLength()]
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
    }
}
