using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("Design")]
    public class Design
    {
        public int Id { get; set; }
        public int DesignNo { get; set;  }
        public string DesignName { get; set; }
    }
}
