using Azure.Core;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using NetOpenX.Rest.Client;
using NetOpenX.Rest.Client.BLL;
using NetOpenX.Rest.Client.Model;
using NetOpenX.Rest.Client.Model.Custom;
using NetOpenX.Rest.Client.Model.Enums;
using NetOpenX.Rest.Client.Model.NetOpenX;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TenderFlow.Core.Grid;
using TenderFlow.Models.Picker;
using TenderFlow.Netsis;
using TenderFlow.Netsis.Models;

namespace TenderFlow.Controllers
{

    public class ShipmentController : Controller
    {
        public async Task<IActionResult> ShipmentOrder()
        {
            await PrepareShipmentOrder();
            return View();
        }

        private async Task PrepareShipmentOrder()
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

            var shipmentManager = new ShipmentManager(con);

            ViewBag.Warehouses = (await shipmentManager.GetWarehousesAsync()).ToList();
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

            var shipmentService = new ShipmentManager(con);
            var orders = await shipmentService.GetShipmentOrdersByIdsAsync(request.Ids);

            ShipmentModel model = new ShipmentModel();
            model.SUBE_KODU = 0;
            model.TIP = 1;
            model.BELGENO = await shipmentService.CreateShipmentDocumentNoAsync(new Netsis.Models.ShipmentModel { SUBE_KODU = 0, TIP = 1 });
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
                line.SIPNO = item;
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

                var shipmentManager = new ShipmentManager(con);
                short rowNumber = 1;
                foreach (var line in model.ShipmentLines)
                {
                    var order = await shipmentManager.GetShipmentOrderAsync(line.ID);

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


                var shipmentNo = await shipmentManager.CreateShipmentAsync(model);

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

        [HttpGet]
        public IActionResult ShipmentOrderManagement()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateDocumentAsync([FromBody] DocumentRequestModel request)
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

            var shipmentService = new ShipmentManager(con);
            var shipments = await shipmentService.GetShipmentManagementsByDocumentNumbersAsync(new List<string>() { request.DocumentNumber });

            foreach (var shipment in shipments)
            {
                var shipmentLines = await shipmentService.GetShipmentLinesAsync(shipment.BELGE_NO);

                oAuth2 auth2 = new oAuth2("http://192.168.1.100:7070");
                var token = await auth2.LoginAsync(new JLogin()
                {
                    BranchCode = 0,
                    DbName = "MAKROLAB25",
                    DbPassword = "",
                    DbType = JNVTTipi.vtMSSQL,
                    DbUser = "TEMELSET",
                    NetsisUser = "Netsis",
                    NetsisPassword = "net2"
                });

                ItemSlipsManager InvoiceManager = new ItemSlipsManager(auth2);
                var fatNo = InvoiceManager.NewEWaybillNumber(new NetOpenX.Rest.Client.Model.Custom.ItemSlipsCodeParam()
                {
                    DocumentType = JTFaturaTip.ftSIrs,
                    Code = "IRS"
                });


                ItemSlips itemSlip = new ItemSlips();
                itemSlip.FaturaTip = JTFaturaTip.ftSIrs;
                itemSlip.SeriliHesapla = false;
                itemSlip.FatUst = new ItemSlipsHeader()
                {
                    FATIRS_NO = fatNo.Data.ToString(),
                    CariKod = shipment.CARI_KODU,
                    Tarih = DateTime.Now,
                    TIPI = JTFaturaTipi.ft_Acik,
                    KDV_DAHILMI = false,
                    Tip = JTFaturaTip.ftSIrs,
                    SIPARIS_TEST = shipment.SEVKTARIHI,
                    FiiliTarih = DateTime.Now,
                    DovBazTarihi = DateTime.Now,
                    EIrsaliye = true,
                };

                itemSlip.Kalems = new List<ItemSlipLines>();
                foreach (var shipmentLine in shipmentLines)
                {
                    itemSlip.Kalems.Add(new ItemSlipLines()
                    {
                        StokKodu = shipmentLine.STOK_KODU,
                        DEPO_KODU = shipmentLine.DEPO_KODU,
                        STra_GCMIK = Convert.ToDouble(shipmentLine.MIKTAR),
                        STra_SIPNUM = shipmentLine.SIPARIS_NO,
                        Sira = shipmentLine.SIRA,
                        Ambarkabulno = shipmentLine.INCKEYNO.ToString(),
                        STra_BF = Convert.ToDouble(shipmentLine.STHAR_BF)

                    });
                }

                itemSlip.EIrsEkBilgi = request.EWaybillInfo;

                var result = InvoiceManager.PostInternal(itemSlip);

                if (result.IsSuccessful)
                {
                    EDocumentManager EDocumentManager = new EDocumentManager(auth2);
                    EDocument eDocument = new EDocument();

                    eDocument.Tip = JTEBelgeTip.ebtEIrs;
                    eDocument.BelgeNo = fatNo.Data.ToString();
                    eDocument.DizaynNo = 9;
                    eDocument.DovizliOlustur = false;

                    var eDocumentResult = EDocumentManager.PostInternal(eDocument);
                    if (eDocumentResult.IsSuccessful)
                    {
                        con.Execute("UPDATE TBLSEVKTRA SET IRSFLAG = 1 WHERE BELGENO = @BELGENO AND TIP = 3",
                             new { BELGENO = request.DocumentNumber }
                         );

                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = eDocumentResult.ErrorDesc });
                    }
                }
                else
                {
                    return Json(new { success = false, errorMessage = result.ErrorDesc });
                }
            }

            return Json(new { success = true });
        }

        public async Task<IActionResult> DocumentView(string documentNumber, string documentType)
        {
            oAuth2 auth2 = new oAuth2("http://192.168.1.100:7070");
            var token = await auth2.LoginAsync(new JLogin()
            {
                BranchCode = 0,
                DbName = "MAKROLAB25",
                DbPassword = "",
                DbType = JNVTTipi.vtMSSQL,
                DbUser = "TEMELSET",
                NetsisUser = "Netsis",
                NetsisPassword = "net2"
            });

            EDocumentManager EDocumentManager = new EDocumentManager(auth2);

            EDocumentShowParam eDocumentShowParam = new EDocumentShowParam
            {
                EDocumentType = documentType == "İrsalie" ? JTEBelgeTip.ebtEIrs : JTEBelgeTip.ebtEFatura,
                GIBDocumentNumber = documentNumber,
                DocumentBoxType = JTEBelgeBoxType.ebAll,
                HtmlPath = "C://TEMP",
                EnvelopeId = ""
            };



            var eDocumentResult = EDocumentManager.ShowEDocument(eDocumentShowParam);
            if (eDocumentResult.IsSuccessful)
            {
                return Content(eDocumentResult.Data.Replace("??", ""), "text/html; charset=utf-8");
            }
            else
            {
                return Content(GetErrorHtml(eDocumentResult.Message), "text/html; charset=utf-8");
            }
        }

        private string GetErrorHtml(string message)
        {
            return $@"
<!DOCTYPE html>
<html lang='tr'>
<head>
    <meta charset='UTF-8'>
    <title>Belge Görüntülenemedi</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background: #fafafa;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #333;
        }}
        .error-box {{
            width: 90%;
            max-width: 500px;
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
        }}
        .error-title {{
            font-size: 22px;
            font-weight: bold;
            color: #c0392b;
            margin-bottom: 15px;
        }}
        .error-message {{
            font-size: 16px;
            margin-bottom: 20px;
        }}
        .btn {{
            display: inline-block;
            padding: 10px 20px;
            background: #3498db;
            color: #fff;
            border-radius: 6px;
            text-decoration: none;
        }}
    </style>
</head>
<body>
    <div class='error-box'>
        <div class='error-title'>Belge Görüntülenemedi</div>
        <div class='error-message'>{message}</div>
        <a class='btn' href='javascript:window.top.closeDocumentModal();'>Kapat</a>
    </div>
</body>
</html>";
        }


        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> ShipmentOrderList()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            dynamic json = JsonConvert.DeserializeObject(body);

            GridCommand grid = JsonConvert.DeserializeObject<GridCommand>(Convert.ToString(json));

            // STRING olarak çekiyoruz
            string cari = Convert.ToString(json.Filters?.cari);
            string start = Convert.ToString(json.Filters?.startDate);
            string end = Convert.ToString(json.Filters?.endDate);
            string depo = Convert.ToString(json.Filters?.depo);
            bool hasBalance = json.Filters?.hasBalance ?? false;

            DateTime? startDate = string.IsNullOrWhiteSpace(start) ? null : Convert.ToDateTime(start);
            DateTime? endDate = string.IsNullOrWhiteSpace(end) ? null : Convert.ToDateTime(end);

            var config = new NetsisConfig
            {
                Server = "192.168.1.100",
                Database = "MAKROLAB25",
                User = "sa",
                Password = "sapass",
            };

            var netsis = new NetsisConnection(config);
            var con = netsis.Open();

            var shipmentManager = new ShipmentManager(con);

            var list = await shipmentManager.GetShipmentOrdersAsync(
                cariKodu: cari,
                startDate: startDate,
                endDate: endDate,
                depo: depo,
                hasBalance: hasBalance
            );

            return Json(new { data = list });
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> ShipmentOrderManagementList()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            dynamic json = JsonConvert.DeserializeObject(body);

            var grid = JsonConvert.DeserializeObject<GridCommand>(body);

            // Filtreler
            string start = Convert.ToString(json.Filters?.startDate);
            string end = Convert.ToString(json.Filters?.endDate);
            int status = Convert.ToInt32(json.Filters?.status);
            bool showCompleted = json.Filters?.showCompleted ?? false;
            bool highlightZeroPrice = json.Filters?.highlightZeroPrice ?? false;

            DateTime? startDate = string.IsNullOrWhiteSpace(start) ? null : Convert.ToDateTime(start);
            DateTime? endDate = string.IsNullOrWhiteSpace(end) ? null : Convert.ToDateTime(end);

            var config = new NetsisConfig
            {
                Server = "192.168.1.100",
                Database = "MAKROLAB25",
                User = "sa",
                Password = "sapass",
            };

            var netsis = new NetsisConnection(config);
            var con = netsis.Open();

            var shipmentManager = new ShipmentManager(con);

            var list = await shipmentManager.GetShipmentManagementsAsync(
                startDate: startDate,
                endDate: endDate,
                status: status,
                showCompleted: showCompleted
            );

            return Json(new
            {
                data = list
            });
        }

        [HttpPost]
        public async Task<IActionResult> DocumentList(string shipmentNo)
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

            var shipmentManager = new ShipmentManager(con);

            var list = await shipmentManager.GetDocuments(shipmentNo: shipmentNo);

            return Json(list);
        }

        [HttpPost]
        public async Task<IActionResult> CustomerList([FromBody] GridCommand command)
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

            var shipmentManager = new ShipmentManager(con);

            var list = await shipmentManager.GetCustomersAsync();

            return Json(list);
        }

        [HttpPost]
        public async Task<IActionResult> ShipmentTemplateList()
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

            var shipmentManager = new ShipmentManager(con);

            var list = await shipmentManager.GetShipmentTemplates();

            return Json(list);
        }

    }
}
