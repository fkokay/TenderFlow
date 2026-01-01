using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;

namespace TenderFlow.Controllers
{
    public class FirmController : Controller
    {
        private readonly TenderFlowContext _db;
        public FirmController(TenderFlowContext db)
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
        public IActionResult Create(CreateFirmModel model)
        {
            if (_db.Firms.Any(x => x.FirmName.ToLower() == model.FirmName.ToLower()))
            {
                return Json(new
                {
                    success = false,
                    message = "Bu firma adı zaten mevcut."
                });
            }
            if (_db.Firms.Any(x => x.FirmCode.ToLower() == model.FirmCode.ToLower()))
            {
                return Json(new
                {
                    success = false,
                    message = "Bu firma kodu zaten mevcut."
                });
            }

            var firm = new Firm();
            firm.FirmCode = model.FirmCode;
            firm.FirmName = model.FirmName;
            firm.TaxNumber = model.TaxNumber;
            firm.RegisterNumber = model.RegisterNumber;
            firm.NetsisRestApiUrl = model.NetsisRestApiUrl;
            firm.NetsisDbServer = model.NetsisDbServer;
            firm.NetsisDbName = model.NetsisDbName;
            firm.NetsisDbUser = model.NetsisDbUser;
            firm.NetsisDbPassword = model.NetsisDbPassword;
            firm.NetsisApplicationName = model.NetsisApplicationName;
            firm.NetsisUser = model.NetsisUser;
            firm.NetsisPassword = model.NetsisPassword;
            firm.NetsisCompanyCode = model.NetsisCompanyCode;
            firm.NetsisBranchCode = model.NetsisBranchCode;
            firm.EIRSSeri = model.EIRSSeri;
            firm.EFATSeri = model.EFATSeri;
            firm.EARSSeri = model.EARSSeri;
            firm.CreatedAt = DateTime.Now;


            _db.Firms.Add(firm);
            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Firma başarıyla eklendi."
            });
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var firm = _db.Firms.FirstOrDefault(x => x.Id == id);

            if (firm == null)
                return NotFound();
            var model = new EditFirmModel();
            model.FirmCode = firm.FirmCode;
            model.FirmName = firm.FirmName;
            model.TaxNumber = firm.TaxNumber;
            model.RegisterNumber = firm.RegisterNumber;
            model.NetsisRestApiUrl = firm.NetsisRestApiUrl;
            model.NetsisDbServer = firm.NetsisDbServer;
            model.NetsisDbName = firm.NetsisDbName;
            model.NetsisDbUser = firm.NetsisDbUser;
            model.NetsisDbPassword = firm.NetsisDbPassword;
            model.NetsisApplicationName = firm.NetsisApplicationName;
            model.NetsisUser = firm.NetsisUser;
            model.NetsisPassword = firm.NetsisPassword;
            model.NetsisCompanyCode = firm.NetsisCompanyCode;
            model.NetsisBranchCode = firm.NetsisBranchCode;
            model.EIRSSeri = firm.EIRSSeri;
            model.EFATSeri = firm.EFATSeri;
            model.EARSSeri = firm.EARSSeri;

            return View(model);
        }
        [HttpPost]
        public IActionResult Edit(EditFirmModel model)
        {
            var firm = _db.Firms.FirstOrDefault(x => x.Id == model.Id);
            if (firm == null)
                return Json(new { success = false, message = "Firma bulunamadı." });

            bool firmNameExists = _db.Firms.Any(x => x.FirmName.ToLower() == model.FirmName.ToLower() & x.Id != model.Id);
            if (firmNameExists)
            {
                return Json(new
                {
                    success = false,
                    message = "Bu firma adı zaten mevcut."
                });
            }
            bool firmCodeExists = _db.Firms.Any(x => x.FirmCode.ToLower() == model.FirmCode.ToLower() & x.Id != model.Id);
            if (firmCodeExists)
            {
                return Json(new
                {
                    success = false,
                    message = "Bu firma kodu zaten mevcut."
                });
            }
            firm.FirmCode = model.FirmCode;
            firm.FirmName = model.FirmName;
            firm.TaxNumber = model.TaxNumber;
            firm.RegisterNumber = model.RegisterNumber;
            firm.NetsisRestApiUrl = model.NetsisRestApiUrl;
            firm.NetsisDbServer = model.NetsisDbServer;
            firm.NetsisDbName = model.NetsisDbName;
            firm.NetsisDbUser = model.NetsisDbUser;
            firm.NetsisDbPassword = model.NetsisDbPassword;
            firm.NetsisApplicationName = model.NetsisApplicationName;
            firm.NetsisUser = model.NetsisUser;
            firm.NetsisPassword = model.NetsisPassword;
            firm.NetsisCompanyCode = model.NetsisCompanyCode;
            firm.NetsisBranchCode = model.NetsisBranchCode;
            firm.EIRSSeri = model.EIRSSeri;
            firm.EFATSeri = model.EFATSeri;
            firm.EARSSeri = model.EARSSeri;

            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Firma bilgisi başarıyla güncellendi."
            });
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            var firm = _db.Firms.FirstOrDefault(x => x.Id == id);

            if (firm == null)
                return Json(new { success = false, message = "Fİrma bulunamadı." });

            _db.Firms.Remove(firm);
            _db.SaveChanges();

            return Json(new
            {
                success = true,
                message = "Firma başarıyla silindi."
            });
        }

        [HttpPost]
        public async Task<IActionResult> FirmList([FromBody] GridCommand gridCommand)
        {
            string searchValue = gridCommand.Search?.Value?.Trim();

            // Base query
            var query = _db.Firms
                .AsNoTracking()
                .Select(f => new FirmModel
                {
                    Id = f.Id,
                    FirmCode = f.FirmCode,
                    FirmName = f.FirmName,
                });


            if (!string.IsNullOrEmpty(searchValue))
            {
                query = query.Where(f =>
                    f.FirmName.Contains(searchValue)
                );
            }
            if (!string.IsNullOrEmpty(searchValue))
            {
                query = query.Where(f =>
                    f.FirmName.Contains(searchValue)
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
                "FirmName" => sortDir == "asc"
                    ? query.OrderBy(x => x.FirmName)
                    : query.OrderByDescending(x => x.FirmName),

                "FirmCode" => sortDir == "asc"
                    ? query.OrderBy(x => x.FirmCode)
                    : query.OrderByDescending(x => x.FirmCode),

                _ => sortDir == "asc"
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id)
            };

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
