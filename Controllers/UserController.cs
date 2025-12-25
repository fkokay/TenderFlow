using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
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
