using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("UserInRole")]
    public class UserInRole : BaseEntity
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public User User { get; set; }
        public Role Role { get; set; }  
    }
}
