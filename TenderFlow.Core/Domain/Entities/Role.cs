using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Role")]
    public class Role : BaseEntity
    {
        public string Name { get; set; }
    }
}
