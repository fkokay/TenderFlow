using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;

namespace TenderFlow.Controllers
{
    public class RoleController : Controller
    {
        private readonly TenderFlowContext _db;
        public RoleController(TenderFlowContext db)
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
        public IActionResult Create(CreateRoleModel model)
        {
            if (_db.Roles.Any(x => x.Name.ToLower() == model.Name.ToLower()))
            {
                return Json(new
                {
                    success = false,
                    message = "Bu rol adı zaten mevcut."
                });
            }

            _db.Roles.Add(new Core.Domain.Entities.Role { Name = model.Name });
            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Rol bilgisi başarıyla eklendi."
            });
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var role = _db.Roles.FirstOrDefault(x => x.Id == id);

            if (role == null)
                return NotFound();

            var model = new EditRoleModel
            {
                Id = role.Id,
                Name = role.Name,
            };

            return View(model);
        }
        [HttpPost]

        public IActionResult Edit(EditRoleModel model)
        {
            var role = _db.Roles.FirstOrDefault(x => x.Id == model.Id);
            if (role == null)
                return Json(new { success = false, message = "Rol bulunamadı." });

            bool roleExists = _db.Roles.Any(x => x.Name.ToLower() == model.Name.ToLower() & x.Id != model.Id);
            if (roleExists)
            {
                return Json(new
                {
                    success = false,
                    message = "Bu rol adı zaten mevcut."
                });
            }
            role.Name = model.Name;

            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Rol bilgisi başarıyla güncellendi."
            });
        }

        [HttpPost]
        public async Task<IActionResult> RoleList([FromBody] GridCommand gridCommand)
        {
            string searchValue = gridCommand.Search?.Value?.Trim();

            // Base query
            var query = _db.Roles
                .AsNoTracking()
                .Select(r => new RoleModel
                {
                    Id = r.Id,
                    Name = r.Name,
                });

            /* ==========================
               SEARCH
            ========================== */
            if (!string.IsNullOrEmpty(searchValue))
            {
                query = query.Where(r =>
                    r.Name.Contains(searchValue)
                );
            }

            /* ==========================
               TOTAL COUNT
            ========================== */
            var totalRecords = await query.CountAsync();

            /* ==========================
               SORTING
            ========================== */
            string sortColumn = "Id";
            string sortDir = "asc";

            if (gridCommand.Order?.Any() == true)
            {
                var order = gridCommand.Order.First();
                sortColumn = gridCommand.Columns[order.Column].Data;
                sortDir = order.Dir;
            }

            query = sortColumn switch
            {
                "Name" => sortDir == "asc"
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),

                _ => sortDir == "asc"
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id)
            };

            /* ==========================
               PAGING
            ========================== */
            var data = await query
                .Skip(gridCommand.Start)
                .Take(gridCommand.Length)
                .ToListAsync();

            return Json(new
            {
                draw = gridCommand.Draw,
                recordsTotal = totalRecords,
                recordsFiltered = totalRecords,
                data
            });
        }
    }
}
