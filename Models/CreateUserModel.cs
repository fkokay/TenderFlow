using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.Models
{
    public class CreateUserModel
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public bool Active { get; set; }
    }
}
