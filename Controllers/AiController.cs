using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TenderFlow.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class AiController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
