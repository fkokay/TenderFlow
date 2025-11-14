using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;

namespace TenderFlow.Controllers
{
    public class TenderController : Controller
    {
        private readonly TenderFlowContext _db;
        public TenderController(TenderFlowContext db)
        {
            _db = db;
        }
        public IActionResult List()
        {
            return View();
        }

        public async Task<IActionResult> Detail(int id)
        {
            var model = await _db.Database.SqlQueryRaw<TenderModel>($"SELECT * FROM VW_Tender WHERE Id={id}").FirstOrDefaultAsync();
            if (model == null)
            {
                return NotFound();
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> TenderListAsync([FromBody] GridCommand gridCommand)
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

            var baseSql = new StringBuilder("SELECT * FROM VW_Tender");

            if (!string.IsNullOrEmpty(searchValue))
                baseSql.Append($" WHERE TenderName LIKE '%{searchValue.Replace("'", "''")}%'");

            var totalCountSql = new StringBuilder("SELECT COUNT(*) AS Value FROM VW_Tender");
            if (!string.IsNullOrEmpty(searchValue))
                totalCountSql.Append($" WHERE TenderName LIKE '%{searchValue.Replace("'", "''")}%'");

            var totalRecords = await _db.Database.SqlQueryRaw<int>(totalCountSql.ToString()).FirstAsync();

            baseSql.Append($" ORDER BY {sortColumn} {sortDirection} OFFSET {gridCommand.Start} ROWS FETCH NEXT {gridCommand.Length} ROWS ONLY");

            var pagedData = await _db.Database.SqlQueryRaw<TenderModel>(baseSql.ToString()).ToListAsync();

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
