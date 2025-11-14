using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TenderFlow.Controllers
{
    public class GuaranteeController : Controller
    {
        private readonly TenderFlowContext _db;
        public GuaranteeController(TenderFlowContext db)
        {
            _db = db;
        }
        public IActionResult List()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GuaranteeListAsync([FromBody] GridCommand gridCommand)
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

            var baseSql = new StringBuilder("SELECT * FROM VW_Guarantee");

            if (!string.IsNullOrEmpty(searchValue))
                baseSql.Append($" WHERE TenderName LIKE '%{searchValue.Replace("'", "''")}%'");

            var totalCountSql = new StringBuilder("SELECT COUNT(*) AS Value FROM VW_Guarantee");
            if (!string.IsNullOrEmpty(searchValue))
                totalCountSql.Append($" WHERE TenderName LIKE '%{searchValue.Replace("'", "''")}%'");

            var totalRecords = await _db.Database.SqlQueryRaw<int>(totalCountSql.ToString()).FirstAsync();

            baseSql.Append($" ORDER BY {sortColumn} {sortDirection} OFFSET {gridCommand.Start} ROWS FETCH NEXT {gridCommand.Length} ROWS ONLY");

            var pagedData = await _db.Database.SqlQueryRaw<GuaranteeModel>(baseSql.ToString()).ToListAsync();

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
