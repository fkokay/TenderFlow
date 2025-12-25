using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TenderFlow.Data;
using TenderFlow.Models;

namespace TenderFlow.Components
{
    public class MenuViewComponent : ViewComponent
    {
        private readonly TenderFlowContext _db;
        public MenuViewComponent(TenderFlowContext db)
        {
            _db = db;
        }
        public IViewComponentResult Invoke()
        {
            MenuModel model = new MenuModel();
            model.Modules = _db.Modules.ToList();
            return View(model);
        }
    }
}
