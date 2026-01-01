namespace TenderFlow.Models
{
    public class EditUserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public string? Password { get; set; }

        public List<int> SelectedRoleIds { get; set; } = new();
        public List<RoleModel> Roles { get; set; } = new();

    }
}
