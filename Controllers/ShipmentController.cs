using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.Core.Grid;
using TenderFlow.Models.Picker;
using TenderFlow.Netsis;
using TenderFlow.Netsis.Models;

namespace TenderFlow.Controllers
{
    public class ShipmentController : Controller
    {
        public IActionResult ShipmentOrder()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateShipment([FromBody] ShipmentRequestModel request)
        {
            var config = new NetsisConfig
            {
                Server = "192.168.1.100",
                Database = "MAKROLAB25",
                User = "sa",
                Password = "sapass",
            };

            var netsis = new NetsisConnection(config);
            var con = netsis.Open();

            var shipmentService = new ShipmentService(con);
            var orders = await shipmentService.GetOrdersByIdsAsync(request.Ids);

            ShipmentModel model = new ShipmentModel();
            model.SUBE_KODU = 0;
            model.TIP = 1;
            model.BELGENO = await shipmentService.NextShipmentDocumentNo(new Netsis.Models.ShipmentModel { SUBE_KODU = 0, TIP = 1 });
            model.TARIH = DateTime.Now;
            model.SEVKTARIHI = DateTime.Now;
            model.KOD1 = null;
            model.KOD2 = null;
            model.ACIK1 = null;
            model.ACIK2 = null;
            model.ACIK3 = null;
            model.KAMYONNO = null;
            model.UPDATEKODU = "Y";
            model.KAYITYAPANKUL = "admin";
            model.KAYITTARIHI = DateTime.Now;
            model.DUZELTMEYAPANKUL = null;
            model.DUZELTMETARIHI = null;
            model.C_YEDEK1 = null;
            model.C_YEDEK2 = null;
            model.C_YEDEK3 = null;
            model.I_YEDEK1 = 0;
            model.I_YEDEK2 = 0;
            model.I_YEDEK3 = 0;
            model.F_YEDEK1 = 0;
            model.F_YEDEK2 = 0;
            model.F_YEDEK3 = 0;
            model.F_YEDEK4 = 0;
            model.T_YEDEK1 = null;
            model.T_YEDEK2 = null;
            model.ACIK4 = null;
            model.ACIK5 = null;
            model.ACIK6 = null;
            model.ACIK7 = null;
            model.ACIK8 = null;
            model.ACIK9 = null;
            model.ACIK10 = null;
            model.SOFORISIM = null;

            short rowNumber = 1;
            foreach (var item in orders)
            {
                ShipmentLineModel line = new ShipmentLineModel();
                line.ID = item.ID;
                line.SUBE_KODU = 0;
                line.TIP = 1;
                line.BELGENO = model.BELGENO;
                line.INCKEYNO = item.ID;
                line.SIPNO = item.SIPARIS_NO;
                line.SIPKONT = item.SIRA;
                line.TESCARI = item.CARI_KODU;
                line.TESCARIADI = item.CARI_ADI;
                line.NAKLIYESEKLI = 0;
                line.TESLIMATYERI = 0;
                line.IRSFLAG = 0;
                line.YUKMIK = 0;
                line.SIRA = rowNumber;
                line.MIKTAR = item.MIKTAR;
                line.MALFISK = 0;
                line.ACIK1 = item.ACIKLAMA1;
                line.ACIK2 = item.ACIKLAMA2;
                line.MIKTAR2 = 0;
                line.STOKKODU = item.STOK_KODU;
                line.STOKADI = item.STOK_ADI;
                line.DEPO = 1;
                line.KAYITYAPANKUL = "admin";
                line.KAYITTARIHI = DateTime.Now;
                line.DUZELTMEYAPANKUL = null;
                line.DUZELTMETARIHI = null;

                model.ShipmentLines.Add(line);

                rowNumber++;
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmShipment(ShipmentModel model)
        {
            try
            {
                var config = new NetsisConfig
                {
                    Server = "192.168.1.100",
                    Database = "MAKROLAB25",
                    User = "sa",
                    Password = "sapass",
                };

                var netsis = new NetsisConnection(config);
                var con = netsis.Open();

                var shipmentService = new ShipmentService(con);
                short rowNumber = 1;
                foreach (var line in model.ShipmentLines)
                {
                    var order = await shipmentService.GetOrdersByIdAsync(line.ID);

                    line.ID = order.ID;
                    line.SUBE_KODU = 0;
                    line.TIP = 1;
                    line.BELGENO = model.BELGENO;
                    line.INCKEYNO = order.ID;
                    line.SIPNO = order.SIPARIS_NO;
                    line.SIPKONT = order.SIRA;
                    line.TESCARI = order.CARI_KODU;
                    line.TESCARIADI = order.CARI_ADI;
                    line.NAKLIYESEKLI = 0;
                    line.TESLIMATYERI = 0;
                    line.IRSFLAG = 0;
                    line.YUKMIK = 0;
                    line.SIRA = rowNumber;
                    line.MALFISK = 0;
                    line.ACIK1 = null;
                    line.ACIK2 = null;
                    line.MIKTAR2 = 0;
                    line.STOKKODU = order.STOK_KODU;
                    line.STOKADI = order.STOK_ADI;
                    line.DEPO = 1;
                    line.KAYITYAPANKUL = "admin";
                    line.KAYITTARIHI = DateTime.Now;
                    line.DUZELTMEYAPANKUL = null;
                    line.DUZELTMETARIHI = null;

                    rowNumber++;
                }


                var shipmentNo = await shipmentService.SaveShipmentAsync(model);

                if (!string.IsNullOrEmpty(shipmentNo))
                {
                    return Json(new { success = true, shipmentNo });
                }
                else
                {
                    throw new Exception("Bilinmeyen bir hata oluştu.");
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }

        public IActionResult ShipmentOrderManagement()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ShipmentOrderList([FromBody] GridCommand gridCommand)
        {
            var config = new NetsisConfig
            {
                Server = "192.168.1.100",
                Database = "MAKROLAB25",
                User = "sa",
                Password = "sapass",

            };

            var netsis = new NetsisConnection(config);
            var con = netsis.Open();

            var shipmentService = new ShipmentService(con);
            var list = await shipmentService.GerOrdersAsync(cariKodu: "");
            return Json(new
            {
                data = list
            });
        }

        [HttpPost]
        public async Task<IActionResult> ShipmentOrderManagementListAsync([FromBody] GridCommand gridCommand)
        {
            var config = new NetsisConfig
            {
                Server = "192.168.1.100",
                Database = "MAKROLAB25",
                User = "sa",
                Password = "sapass",

            };

            var netsis = new NetsisConnection(config);
            var con = netsis.Open();

            var shipmentService = new ShipmentService(con);
            var list = await shipmentService.GetOrderManagementsAsync();
            return Json(new
            {
                data = list
            });
        }
    }
}
