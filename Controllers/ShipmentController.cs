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
using TenderFlow.Core.Grid;
using TenderFlow.Models;
using TenderFlow.Models.Picker;
using TenderFlow.Netsis;
using TenderFlow.Netsis.Models;

namespace TenderFlow.Controllers
{

    public class ShipmentController : Controller
    {
        [HttpGet]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> OrderList()
        {
            await PrepareShipmentOrder();
            return View();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> Create([FromBody] ShipmentRequestModel request)
        {
            ShipmentModel model = new ShipmentModel();
            await PrepareShipmentCreate(request,model);
            return View(model);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> CreateShipment(ShipmentModel model)
        {
            try
            {
                using var con = CreateNetsisConnection();

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
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> Edit(string belgeNo)
        {
            using var con = CreateNetsisConnection();

            var shipmentService = new ShipmentManager(con);
            var model = await shipmentService.GetShipmentAsync(belgeNo);

            if (model == null)
                return NotFound();

            return View("Edit", model);
        }

        [HttpGet]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> OrderDetails(string siparisNo)
        {
            using var con = CreateNetsisConnection();

            var shipmentService = new ShipmentManager(con);
            var model = await shipmentService.GetOrderDetailsAsync(siparisNo);

            if (model == null)
                return NotFound("Sipariş bulunamadı.");

            return View("OrderDetails", model);
        }

        [HttpGet]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public IActionResult OrderManagement()
        {
            return View();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> OrderList([FromBody] OrderListRequest request)
        {
            using var con = CreateNetsisConnection();

            var shipmentManager = new ShipmentManager(con);

            var list = await shipmentManager.GetShipmentOrdersAsync(
                cariKodu: request.Filters.Cari,
                startDate: request.Filters.StartDate,
                endDate: request.Filters.EndDate,
                depo: request.Filters.Depo,
                hasBalance: request.Filters.HasBalance
            );

            return Json(new { data = list });
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> OrderManagementList([FromBody] OrderManagementListListRequest request)
        {
            using var con = CreateNetsisConnection();

            var manager = new ShipmentManager(con);

            var list = await manager.GetShipmentManagementsAsync(
                startDate: request.Filters.StartDate,
                endDate: request.Filters.EndDate,
                status: request.Filters.Status,
                showCompleted: request.Filters.ShowCompleted
            );

            return Json(new
            {
                data = list
            });
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> DocumentList(string shipmentNo)
        {
            using var con = CreateNetsisConnection();

            var manager = new ShipmentManager(con);
            var list = await manager.GetDocuments(shipmentNo: shipmentNo);

            return Json(list);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> CreateDocumentAsync([FromBody] DocumentRequestModel request)
        {
            if (string.IsNullOrEmpty(request.DocumentNumber))
            {
                return Json(new { success = false, errorMessage = "Belge numarası boş olamaz." });
            }

            using var con = CreateNetsisConnection();

            var shipmentService = new ShipmentManager(con);
            var shipments = await shipmentService.GetShipmentManagementsByDocumentNumbersAsync(new List<string> { request.DocumentNumber });

            foreach (var shipment in shipments)
            {
                var order = await shipmentService.GetOrderDetailsAsync(shipment.SIPARIS_NO);
                if (order == null)
                {
                    return Json(new { success = false, errorMessage = "Sipariş bilgileri alınamadı." });
                }

                var shipmentLines = await shipmentService.GetShipmentOrderLinesAsync(shipment.BELGE_NO);

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
                    ENTEGRE_TRH = DateTime.Now,
                    TIPI = JTFaturaTipi.ft_Acik,
                    KDV_DAHILMI = false,
                    Tip = JTFaturaTip.ftSIrs,
                    SIPARIS_TEST = shipment.SEVKTARIHI,
                    FiiliTarih = DateTime.Now,
                    DovBazTarihi = DateTime.Now,
                    EIrsaliye = true,
                    Aciklama = order.ACIKLAMA,
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
                        STra_SIPKONT = shipmentLine.SIPARIS_SIRA,
                        Ambarkabulno = shipmentLine.INCKEYNO.ToString(),
                        STra_BF = Convert.ToDouble(shipmentLine.STHAR_BF),
                        STra_DOVFIAT = shipmentLine.STHAR_DOVFIAT == null ? null : Convert.ToDouble(shipmentLine.STHAR_DOVFIAT),
                        STra_DOVTIP = shipmentLine.STHAR_DOVTIP,
                        STra_SatIsk = shipmentLine.STHAR_SATISK == null ? null : Convert.ToDouble(shipmentLine.STHAR_SATISK),
                        STra_SatIsk2 = shipmentLine.STHAR_SATISK2 == null ? null : Convert.ToDouble(shipmentLine.STHAR_SATISK2),
                        STra_SatIsk3 = shipmentLine.STRA_SATISK3 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK3),
                        STra_SatIsk4 = shipmentLine.STRA_SATISK4 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK4),
                        STra_SatIsk5 = shipmentLine.STRA_SATISK5 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK5),
                        STra_SatIsk6 = shipmentLine.STRA_SATISK6 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK6),
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
        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> CreateInvoiceAsync([FromBody] DocumentRequestModel request)
        {
            if (string.IsNullOrEmpty(request.DocumentNumber))
            {
                return Json(new { success = false, errorMessage = "Belge numarası boş olamaz." });
            }

            using var con = CreateNetsisConnection();

            var shipmentService = new ShipmentManager(con);
            var shipments = await shipmentService.GetShipmentManagementsByDocumentNumbersAsync(new List<string> { request.DocumentNumber });

            foreach (var shipment in shipments)
            {
                var order = await shipmentService.GetOrderDetailsAsync(shipment.SIPARIS_NO);
                if (order == null)
                {
                    return Json(new { success = false, errorMessage = "Sipariş bilgileri alınamadı." });
                }

                var shipmentLines = await shipmentService.GetShipmentOrderLinesAsync(shipment.BELGE_NO);

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

                string fatNo = string.Empty;
                if (request.EInovice)
                {
                    var fatNoResult = InvoiceManager.NewNumber(new NetOpenX.Rest.Client.Model.Custom.ItemSlipsCodeParam()
                    {
                        DocumentType = JTFaturaTip.ftSFat,
                        Code = "MKL"
                    });
                    fatNo = fatNoResult.Data.ToString();
                }
                else
                {
                    var fatNoResult = InvoiceManager.NewEArchiveNumber("EAR");
                    fatNo = fatNoResult.Data.ToString();
                }

                ItemSlips itemSlip = new ItemSlips();
                itemSlip.FaturaTip = JTFaturaTip.ftSFat;
                itemSlip.SeriliHesapla = false;
                itemSlip.FatUst = new ItemSlipsHeader()
                {
                    FATIRS_NO = fatNo,
                    CariKod = shipment.CARI_KODU,
                    Tarih = DateTime.Now,
                    ENTEGRE_TRH = DateTime.Now,
                    TIPI = JTFaturaTipi.ft_Acik,
                    KDV_DAHILMI = false,
                    Tip = JTFaturaTip.ftSFat,
                    FiiliTarih = DateTime.Now,
                    DovBazTarihi = DateTime.Now,
                    Aciklama = order.ACIKLAMA,
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
                        STra_SIPKONT = shipmentLine.SIPARIS_SIRA,
                        Ambarkabulno = shipmentLine.INCKEYNO.ToString(),
                        STra_BF = Convert.ToDouble(shipmentLine.STHAR_BF),
                        STra_DOVFIAT = shipmentLine.STHAR_DOVFIAT == null ? null : Convert.ToDouble(shipmentLine.STHAR_DOVFIAT),
                        STra_DOVTIP = shipmentLine.STHAR_DOVTIP,
                        STra_SatIsk = shipmentLine.STHAR_SATISK == null ? null : Convert.ToDouble(shipmentLine.STHAR_SATISK),
                        STra_SatIsk2 = shipmentLine.STHAR_SATISK2 == null ? null : Convert.ToDouble(shipmentLine.STHAR_SATISK2),
                        STra_SatIsk3 = shipmentLine.STRA_SATISK3 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK3),
                        STra_SatIsk4 = shipmentLine.STRA_SATISK4 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK4),
                        STra_SatIsk5 = shipmentLine.STRA_SATISK5 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK5),
                        STra_SatIsk6 = shipmentLine.STRA_SATISK6 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK6),
                    });

                }

                var result = InvoiceManager.PostInternal(itemSlip);

                if (result.IsSuccessful)
                {
                    EDocumentManager EDocumentManager = new EDocumentManager(auth2);
                    EDocument eDocument = new EDocument();

                    eDocument.Tip = request.EInovice ? JTEBelgeTip.ebtEFatura : JTEBelgeTip.ebtArsiv;
                    eDocument.BelgeNo = result.Data.FatUst.FATIRS_NO;
                    eDocument.DizaynKontrol = false;

                    var eDocumentResult = EDocumentManager.PostInternal(eDocument);
                    if (eDocumentResult.IsSuccessful)
                    {
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

        [HttpGet]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> DocumentView(string documentNumber,bool einvoice, string documentType)
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
                EDocumentType = documentType == "İrsalie" ? JTEBelgeTip.ebtEIrs : einvoice ? JTEBelgeTip.ebtEFatura : JTEBelgeTip.ebtArsiv,
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

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> CustomerList([FromBody] GridCommand command)
        {
            using var con = CreateNetsisConnection();

            var manager = new ShipmentManager(con);
            var list = await manager.GetCustomersAsync();

            return Json(list);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> ShipmentTemplateList()
        {
            using var con = CreateNetsisConnection();

            var shipmentManager = new ShipmentManager(con);
            var list = await shipmentManager.GetShipmentTemplates();

            return Json(list);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> DeleteAsync([FromBody] DeleteShipmentRequest request)
        {
            try
            {
                using var con = CreateNetsisConnection();

                var shipmentManager = new ShipmentManager(con);
                var result = await shipmentManager.DeleteShipmentAsync(request.DocumentNumber);

                return Json(new { success = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }


        private SqlConnection CreateNetsisConnection()
        {
            var config = new NetsisConfig
            {
                Server = "192.168.1.100",
                Database = "MAKROLAB25",
                User = "sa",
                Password = "sapass"
            };

            return new NetsisConnection(config).Open();
        }
        private async Task PrepareShipmentOrder()
        {
            using var con = CreateNetsisConnection();
            var manager = new ShipmentManager(con);

            ViewBag.Warehouses = (await manager.GetWarehousesAsync()).ToList();
        }
        private async Task PrepareShipmentCreate(ShipmentRequestModel request, ShipmentModel model)
        {
            using var con = CreateNetsisConnection();

            var shipmentService = new ShipmentManager(con);
            var orders = await shipmentService.GetShipmentOrdersByIdsAsync(request.Ids);

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
            model.KISMI_TESLIMAT = true;
            model.KAPALI = false;

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
        }
        private string GetErrorHtml(string message)
        {
            var safeMessage = System.Net.WebUtility.HtmlEncode(message ?? "Bilinmeyen hata");

            return $@"
            <!DOCTYPE html>
            <html lang='tr'>
            <head>
              <meta charset='UTF-8'>
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <title>Belge Görüntülenemedi</title>
              <style>
                body {{ font-family: Arial; background:#fafafa; margin:0; display:flex; align-items:center; justify-content:center; height:100vh; }}
                .error-box {{ width:90%; max-width:520px; background:#fff; padding:28px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,.08); text-align:center; }}
                .error-title {{ font-size:22px; font-weight:700; color:#c0392b; margin-bottom:12px; }}
                .error-message {{ font-size:16px; margin-bottom:18px; word-break:break-word; }}
                .btn {{ padding:10px 18px; background:#3498db; color:#fff; border:0; border-radius:6px; cursor:pointer; }}
              </style>
            </head>
            <body>
              <div class='error-box'>
                <div class='error-title'>Belge Görüntülenemedi</div>
                <div class='error-message'>{safeMessage}</div>
              </div>
            </body>
            </html>";
        }

        private string CurrentUser => User.Identity?.Name ?? "SYSTEM";

    }
}
