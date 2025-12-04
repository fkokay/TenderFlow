using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TenderFlow.Data;
using TenderFlow.Models.Identity;

namespace TenderFlow.Controllers
{
    public class IdentityController : Controller
    {
        private readonly TenderFlowContext _db;
        public IdentityController(TenderFlowContext db)
        {
            _db = db;
        }
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _db.Users.Where(x => x.Email == model.Email && x.Active == true).FirstOrDefaultAsync();

            if (user == null)
            {
                return Json(new { success = false, message = "Kullanıcı bulunamadı." });
            }

            if (user.Password != model.Password)
            {
                return Json(new { success = false, message = "Şifre hatalı." });
            }

            var roles = await _db.UserInRoles.Where(x => x.UserId == user.Id).Include(m => m.Role).Select(x => x.Role.Name).ToListAsync();

            var userClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.MobilePhone, user.Phone ?? "")
            };

            foreach (var role in roles)
            {
                userClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var identity = new ClaimsIdentity(userClaims, "TenderFlowAuth");
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(principal);

            return Json(new { success = true });
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public IActionResult ForgotPassword(ForgotPasswordModel model)
        {
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> LogoutAsync()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login", "Identity");
        }
    }
}
