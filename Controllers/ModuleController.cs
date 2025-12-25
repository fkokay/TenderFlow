using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;

namespace TenderFlow.Controllers
{
    public class ModuleController : Controller
    {
        private readonly TenderFlowContext _db;
        public ModuleController(TenderFlowContext db)
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
        public IActionResult Create(CreateModuleModel model)
        {
            if (_db.Modules.Any(x => x.Name.ToLower() == model.Name.ToLower()))
            {
                return Json(new { success = false, message = "Bu modül ismi zaten kayıtlı." });
            }
            if (_db.Modules.Any(x => x.Code.ToLower() == model.Code.ToLower()))
            {
                return Json(new { success = false, message = "Bu  modül kodu zaten kayıtlı." });
            }

            var module = new Module
            {
                Name = model.Name,
                Code = model.Code,
                IsActive=true,
            };

            _db.Modules.Add(module);
            _db.SaveChanges();

            return Json(new { success = true, message = "Modül bilgisi başarıyla kaydedildi." });
        }


        [HttpGet]
        public IActionResult Edit(int id)
        {
            var module = _db.Modules.FirstOrDefault(x => x.Id == id);
            
            if (module == null)
                return NotFound();

            var model = new EditModuleModel
            {
                Id = module.Id,
                Name = module.Name,
                Code = module.Code,
                IsActive = module.IsActive
            };

            return View(model);
        }
        [HttpPost]

        public IActionResult Edit(EditModuleModel model)
        {
            var module = _db.Modules.FirstOrDefault(x => x.Id == model.Id);
            if (module == null)
                return Json(new { success = false, message = "Modül bulunamadı." });


            if (_db.Modules.Any(x => x.Name.ToLower() == model.Name.ToLower() & x.Id != model.Id))
            {
                return Json(new { success = false, message = "Bu modül ismi zaten kayıtlı." });
            }
            if (_db.Modules.Any(x => x.Code.ToLower() == model.Code.ToLower() & x.Id != model.Id))
            {
                return Json(new { success = false, message = "Bu  modül kodu zaten kayıtlı." });
            }


            module.Name = model.Name;
            module.Name = model.Name;
            module.IsActive = model.IsActive;
            
            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Modül bilgisi başarıyla güncellendi."
            });
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            var module = _db.Modules.FirstOrDefault(x => x.Id == id);

            if (module == null)
                return Json(new { success = false, message = "Modül bulunamadı." });

            _db.Modules.Remove(module);
            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Modül başarıyla silindi."
            });
        }


        [HttpPost]
        public async Task<IActionResult> ModuleList([FromBody] GridCommand gridCommand)
        {
            string searchValue = gridCommand.Search?.Value?.Trim();

            // Base query
            var query = _db.Modules
                .AsNoTracking()
                .Select(m => new ModuleModel
                {
                    Id = m.Id,
                    Name = m.Name,
                    IsActive = m.IsActive,
                    Code= m.Code
                });


            if (!string.IsNullOrEmpty(searchValue))
            {
                query = query.Where(r =>
                    r.Name.Contains(searchValue)
                );
            }

           
            var totalRecords = await query.CountAsync();

           
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
                "Code" => sortDir == "asc"
                    ? query.OrderBy(x => x.Code)
                    : query.OrderByDescending(x => x.Code),

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
