using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetOpenX.Rest.Client;
using NetOpenX.Rest.Client.BLL;
using NetOpenX.Rest.Client.Model;
using NetOpenX.Rest.Client.Model.NetOpenX;
using System.Globalization;
using TenderFlow.Core.Utils;
using TenderFlow.Data;
using TenderFlow.Models.Api;

namespace TenderFlow.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TenderController : ControllerBase
    {
        private readonly TenderFlowContext _db;
        public TenderController(TenderFlowContext db)
        {
            _db = db;
        }


        [HttpPost]
        public async Task<IActionResult> DocumentAsync(TenderDeviceModel model)
        {
            var tender = await _db.Tenders.FirstOrDefaultAsync(m => m.Id == model.TenderId);
            if (tender == null)
            {
                return Ok(new { status = false, message = "İhale bulunamadı" });
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> DeviceAsync(TenderDeviceModel model)
        {
            var tender = await _db.Tenders.FirstOrDefaultAsync(m => m.Id == model.TenderId);
            if (tender == null)
            {
                return Ok(new { status = false, message = "İhale bulunamadı" });
            }

            var period = DateUtils.GetMonthDifference(tender.TenderStartDate, tender.TenderEndDate);

            var tenderDevices = _db.TenderDevices.Where(m => m.TenderId == model.TenderId).ToList();
            if (tenderDevices.Count == 0)
            {
                return Ok(new { status = false, message = "İhaleye ait cihaz bulunamadı" });
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


            var rentDevices = tenderDevices.Where(m => m.SupplyType == "Kira").ToList();
            var rentCustomers = rentDevices.Select(m => m.CustomerCode).Distinct().ToList();
            foreach (var item in rentCustomers)
            {
                var devices = rentDevices.Where(m => m.CustomerCode == item).ToList();

                for (int i = 1; i <= period; i++)
                {
                    ItemSlipsManager itemSlipsManager = new ItemSlipsManager(auth2);
                    ItemSlips slips = new ItemSlips();
                    slips.FaturaTip = NetOpenX.Rest.Client.Model.Enums.JTFaturaTip.ftASip;
                    slips.SeriliHesapla = false;
                    slips.KayitliNumaraOtomatikGuncellensin = true;
                    slips.FatUst = new ItemSlipsHeader();
                    slips.FatUst.TIPI = NetOpenX.Rest.Client.Model.Enums.JTFaturaTipi.ft_Acik;
                    slips.FatUst.CariKod = item;
                    slips.FatUst.Tarih = DateTime.Now.AddMonths(i);
                    slips.FatUst.FIYATTARIHI = DateTime.Now.AddMonths(i).Date;
                    slips.FatUst.KDV_DAHILMI = true;
                    slips.FatUst.PLA_KODU = tender.TenderCode;
                    slips.FatUst.KOD1 = "L";
                    slips.FatUst.Aciklama = $"{tender.TenderCode} | {item} | {DateTime.Now.AddMonths(i).Date.ToString()} dönemi aylık kira siparişi";

                    slips.Kalems = new List<ItemSlipLines>();
                    foreach (var device in devices)
                    {
                        slips.Kalems.Add(new ItemSlipLines
                        {
                            StokKodu = device.StockCode,
                            STra_GCMIK = device.Quantity,
                            STra_BF = Convert.ToDouble(device.RentUnitPrice),
                            DEPO_KODU = 1,
                        });
                    }

                    var resultSatis = itemSlipsManager.PostInternal(slips);
                }
            }

            var purchaseDevices = tenderDevices.Where(m => m.SupplyType == "Satınalma").ToList();
            var purchaseCustomers = purchaseDevices.Select(m => m.CustomerCode).Distinct().ToList();
            foreach (var item in rentCustomers)
            {
                var devices = purchaseDevices.Where(m => m.CustomerCode == item).ToList();

                ItemSlipsManager itemSlipsManager = new ItemSlipsManager(auth2);
                ItemSlips slips = new ItemSlips();
                slips.FaturaTip = NetOpenX.Rest.Client.Model.Enums.JTFaturaTip.ftASip;
                slips.SeriliHesapla = false;
                slips.KayitliNumaraOtomatikGuncellensin = true;
                slips.FatUst = new ItemSlipsHeader();
                slips.FatUst.TIPI = NetOpenX.Rest.Client.Model.Enums.JTFaturaTipi.ft_Acik;
                slips.FatUst.CariKod = item;
                slips.FatUst.Tarih = DateTime.Now.Date;
                slips.FatUst.FIYATTARIHI = DateTime.Now.Date;
                slips.FatUst.KDV_DAHILMI = true;
                slips.FatUst.PLA_KODU = tender.TenderCode;
                slips.FatUst.KOD1 = "L";
                slips.FatUst.Aciklama = $"{tender.TenderCode} | {item} | satınalma siparişi";

                slips.Kalems = new List<ItemSlipLines>();
                foreach (var device in devices)
                {
                    slips.Kalems.Add(new ItemSlipLines
                    {
                        StokKodu = device.StockCode,
                        STra_GCMIK = device.Quantity,
                        STra_BF = Convert.ToDouble(device.RentUnitPrice),
                        DEPO_KODU = 1,
                    });
                }

                var resultSatis = itemSlipsManager.PostInternal(slips);
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> ReaktifAsync(TenderDeviceModel model)
        {
            var tender = await _db.Tenders.FirstOrDefaultAsync(m => m.Id == model.TenderId);
            if (tender == null)
            {
                return Ok(new { status = false, message = "İhale bulunamadı" });
            }

            var period = DateUtils.GetMonthDifference(tender.TenderStartDate, tender.TenderEndDate);

            var tenderReaktifs = _db.TenderReaktifs.Where(m => m.TenderId == model.TenderId).ToList();
            if (tenderReaktifs.Count == 0)
            {
                return Ok(new { status = false, message = "İhaleye ait reaktif bulunamadı" });
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

            ItemSlipsManager itemSlipsManager = new ItemSlipsManager(auth2);
            ItemSlips slips = new ItemSlips();
            slips.FaturaTip = NetOpenX.Rest.Client.Model.Enums.JTFaturaTip.ftASip;
            slips.SeriliHesapla = false;
            slips.KayitliNumaraOtomatikGuncellensin = true;
            slips.FatUst = new ItemSlipsHeader();
            slips.FatUst.TIPI = NetOpenX.Rest.Client.Model.Enums.JTFaturaTipi.ft_Acik;
            slips.FatUst.CariKod = "320-34-019";
            slips.FatUst.Tarih = DateTime.Now.Date;
            slips.FatUst.FIYATTARIHI = DateTime.Now.Date;
            slips.FatUst.KDV_DAHILMI = true;
            slips.FatUst.PLA_KODU = tender.TenderCode;
            slips.FatUst.KOD1 = "L";
            slips.FatUst.Aciklama = $"{tender.TenderCode} | reaktif siparişi";

            slips.Kalems = new List<ItemSlipLines>();
            foreach (var reaktif in tenderReaktifs)
            {
                slips.Kalems.Add(new ItemSlipLines
                {
                    StokKodu = reaktif.StockCode,
                    STra_GCMIK = Convert.ToDouble((reaktif.TestCount / period )* 2),
                    STra_BF = Convert.ToDouble(reaktif.UnitPrice),
                    DEPO_KODU = 1,
                });
            }

            var resultSatis = itemSlipsManager.PostInternal(slips);


            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> OpexAsync(TenderDeviceModel model)
        {
            return Ok();
        }


    }
}
