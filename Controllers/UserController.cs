using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;

namespace TenderFlow.Controllers
{
    public class UserController : Controller
    {
        private readonly TenderFlowContext _db;
        public UserController(TenderFlowContext db)
        {
            _db = db;
        }
        public IActionResult List()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(CreateUserModel model)
        {
            if (_db.Users.Any(x => x.Email.ToLower() == model.Email.ToLower()))
            {
                return Json(new { success = false, message = "Bu e-posta adresi zaten kayıtlı." });
            }

            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                Phone = model.Phone,
                Password = model.Password,
                Active = true
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            var role = _db.Roles.FirstOrDefault(x => x.Name == "Kullanıcı");
            if (role != null)
            {
                _db.UserInRoles.Add(new UserInRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                });
                _db.SaveChanges();
            }

            return Json(new { success = true, message = "Kullanıcı bilgisi başarıyla kaydedildi." });
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == id);
            var roles = _db.Roles.ToList();
            if (user == null)
                return NotFound();

            var model = new EditUserModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Email = user.Email,
                Active = user.Active,
                SelectedRoleIds = _db.UserInRoles
                    .Where(x => x.UserId == id)
                    .Select(x => x.RoleId)
                    .ToList(),
                Roles = roles.Select(r => new RoleModel
                {
                    Id = r.Id,
                    Name = r.Name
                }).ToList()
            };

            return View(model);
        }
        [HttpPost]
       
        public IActionResult Edit(EditUserModel model)
        {
            var user = _db.Users.FirstOrDefault(x => x.Id == model.Id);
            if (user == null)
                return Json(new { success = false, message = "Kullanıcı bulunamadı." });

            
            bool emailExists = _db.Users.Any(x => x.Email == model.Email && x.Id != model.Id);
            if (emailExists)
            {
                return Json(new { success = false, message = "Bu e-posta adresi başka bir kullanıcıya ait." });
            }

            
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Phone = model.Phone;
            user.Email = model.Email;
            user.Active = model.Active;

            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                user.Password = model.Password;
            }

            var oldRoles = _db.UserInRoles.Where(x => x.UserId == user.Id);
            _db.UserInRoles.RemoveRange(oldRoles);

            if (model.SelectedRoleIds != null)
            {
                foreach (var roleId in model.SelectedRoleIds)
                {
                    _db.UserInRoles.Add(new UserInRole
                    {
                        UserId = user.Id,
                        RoleId = roleId
                    });
                }
            }
            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Kullanıcı bilgisi başarıyla güncellendi."
            });
        }

        [HttpPost]
        public async Task<IActionResult> UserList([FromBody] GridCommand gridCommand)
        {
            string searchValue = gridCommand.Search?.Value?.Trim() ?? string.Empty;

            string sortColumn = "Id";
            string sortDirection = "ASC";

            if (gridCommand.Order?.Count > 0)
            {
                var order = gridCommand.Order.First();
                var columnName = gridCommand.Columns[order.Column].Data;
                if (!string.IsNullOrEmpty(columnName))
                {
                    sortColumn = columnName;
                    sortDirection = order.Dir?.ToUpper() == "DESC" ? "DESC" : "ASC";
                }
            }

            var baseSql = new StringBuilder(@"
            SELECT
                usr.Id,
                usr.FirstName,
                usr.LastName,
                usr.Email,
                usr.Phone,
                usr.Active,
                usr.Password,
                STUFF((
                    SELECT ', ' + role.Name
                    FROM [UserInRole] userRole
                    INNER JOIN [Role] role ON role.Id = userRole.RoleId
                    WHERE userRole.UserId = usr.Id
                    FOR XML PATH(''), TYPE
                ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS Roles
            FROM [User] usr
            ");


            if (!string.IsNullOrEmpty(searchValue))
                baseSql.Append($@"
                    WHERE FirstName LIKE '%{searchValue}%'
                       OR LastName  LIKE '%{searchValue}%'
                       OR Email     LIKE '%{searchValue}%'
                ");

            var totalCountSql = new StringBuilder("SELECT COUNT(*) AS Value FROM [User]");
            if (!string.IsNullOrEmpty(searchValue))
                totalCountSql.Append($" WHERE FirstName LIKE '%{searchValue.Replace("'", "''")}%' OR LastName LIKE '%{searchValue.Replace("'", "''")}%' OR Email LIKE '%{searchValue.Replace("'", "''")}%'  ");

            var totalRecords = await _db.Database.SqlQueryRaw<int>(totalCountSql.ToString()).FirstAsync();

            baseSql.Append($" ORDER BY {sortColumn} {sortDirection} OFFSET {gridCommand.Start} ROWS FETCH NEXT {gridCommand.Length} ROWS ONLY");

            var pagedData = await _db.Database.SqlQueryRaw<UserModel>(baseSql.ToString()).ToListAsync();

            return Json(new
            {
                draw = gridCommand.Draw,
                recordsTotal = totalRecords,
                recordsFiltered = totalRecords,
                data = pagedData
            });
        }

    }
}
