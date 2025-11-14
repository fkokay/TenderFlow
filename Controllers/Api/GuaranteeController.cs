using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetOpenX.Rest.Client;
using NetOpenX.Rest.Client.Model;
using System.Threading.Tasks;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Core.Utils;
using TenderFlow.Data;
using TenderFlow.Models.Api;

namespace TenderFlow.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GuaranteeController : ControllerBase
    {
        private readonly TenderFlowContext _db;
        public GuaranteeController(TenderFlowContext db)
        {
            _db = db;
        }

        [HttpPost]
        public IActionResult Cancel()
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CommissionCalculate(GuaranteeCommissionCalculateModel model)
        {
            try
            {
                var guarantee = await _db.Guarantees.Include(m => m.CommissionPeriod).Where(m => m.Id == model.GuranteeId).FirstOrDefaultAsync();
                if (guarantee == null)
                {
                    return NotFound();
                }

                oAuth2 auth2 = new oAuth2("http://192.168.1.100:7070");
                var token = await auth2.LoginAsync(new JLogin()
                {
                    BranchCode = 0,
                    DbName = "TEST2025",
                    DbPassword = "",
                    DbType = JNVTTipi.vtMSSQL,
                    DbUser = "TEMELSET",
                    NetsisUser = "Netsis",
                    NetsisPassword = "net2"
                });

                var period = DateUtils.GetMonthDifference(guarantee.GuaranteeDate, guarantee.ExpiryDate);
                for (int i = 0; i < period / guarantee.CommissionPeriod.Period; i++)
                {
                    GuaranteeCommission commission = new GuaranteeCommission();
                    commission.GuaranteeId = guarantee.Id;
                    commission.CommissionStartDate = guarantee.GuaranteeDate.AddMonths(i * guarantee.CommissionPeriod.Period);
                    commission.CommissionEndDate = guarantee.GuaranteeDate.AddMonths((i + 1) * guarantee.CommissionPeriod.Period);
                    commission.CommissionRate = guarantee.CommissionRate;
                    commission.CommissionAmount = Math.Round(guarantee.GuaranteeAmount * guarantee.CommissionRate * (guarantee.CommissionPeriod.Period / 12m), 2, MidpointRounding.AwayFromZero);
                    commission.Currency = guarantee.Currency;
                    commission.PaymentStatus = "Beklemede";
                    commission.CreatedAt = DateTime.Now;
                    commission.CreatedBy = "System";
                    _db.GuaranteeCommissions.Add(commission);
                    await _db.SaveChangesAsync();
                }


                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
