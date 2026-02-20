using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("ShipmentPrint")]
    public class ShipmentPrint
    {
        [Key]
        public int Id { get; set; }
        public string ShipmentNo { get; set; }
        public int PrintCount { get; set; }
    }
}
