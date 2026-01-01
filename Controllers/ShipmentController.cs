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
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Core.Grid;
using TenderFlow.Data;
using TenderFlow.Models;
using TenderFlow.Models.Picker;
using TenderFlow.Netsis;
using TenderFlow.Netsis.Models;

namespace TenderFlow.Controllers
{

    public class ShipmentController : Controller
    {
        private readonly TenderFlowContext _db;
        public ShipmentController(TenderFlowContext db)
        {
            _db = db;
        }

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
            await PrepareShipmentCreate(request, model);
            return View(model);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> CreateShipment(ShipmentModel model)
        {
            try
            {
                var firm = _db.Firms.FirstOrDefault();
                if (firm == null)
                {
                    return NotFound("Firma bilgileri bulunamadı.");
                }
                using var con = CreateNetsisConnection(firm);

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
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

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
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

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
            ViewBag.CreateShipmentInvoice = _db.Settings.Where(s => s.Key == "CreateShipmentInvoice").Select(s => s.Value).FirstOrDefault();
            ViewBag.CreateShipmentDispatch = _db.Settings.Where(s => s.Key == "CreateShipmentDispatch").Select(s => s.Value).FirstOrDefault();
            return View();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış")]
        public async Task<IActionResult> OrderList([FromBody] OrderListRequest request)
        {
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

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
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

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
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

            var manager = new ShipmentManager(con);
            var list = await manager.GetDocuments(shipmentNo: shipmentNo);

            return Json(list);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> CreateDocumentAsync([FromBody] DocumentRequestModel request)
        {
            if (!request.SevkEmirNumaralari.Any())
            {
                return Json(new { success = false, errorMessage = "Belge numarası boş olamaz." });
            }

            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

            var shipmentService = new ShipmentManager(con);
            var result = await shipmentService.GetBelgeOlusacakToplamaKalemleri(firm.NetsisDbName, request.SevkEmirNumaralari);

            var shipments = await shipmentService.GetShipmentManagementsByDocumentNumbersAsync(request.SevkEmirNumaralari);

            foreach (var shipment in shipments)
            {
                var order = await shipmentService.GetOrderDetailsAsync(shipment.SIPARIS_NO);
                if (order == null)
                {
                    return Json(new { success = false, errorMessage = "Sipariş bilgileri alınamadı." });
                }

                var shipmentLines = await shipmentService.GetShipmentOrderLinesAsync(shipment.BELGE_NO);

                oAuth2 auth2 = new oAuth2(firm.NetsisRestApiUrl);
                var token = await auth2.LoginAsync(new JLogin()
                {
                    BranchCode = firm.NetsisBranchCode,
                    DbName = firm.NetsisDbName,
                    DbPassword = "",
                    DbType = JNVTTipi.vtMSSQL,
                    DbUser = "TEMELSET",
                    NetsisUser = firm.NetsisUser,
                    NetsisPassword = firm.NetsisPassword
                });

                ItemSlipsManager InvoiceManager = new ItemSlipsManager(auth2);
                var fatNo = InvoiceManager.NewEWaybillNumber(new NetOpenX.Rest.Client.Model.Custom.ItemSlipsCodeParam()
                {
                    DocumentType = JTFaturaTip.ftSIrs,
                    Code = firm.EIRSSeri
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
                    var kalem = new ItemSlipLines()
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
                        STra_SatIsk6 = shipmentLine.STRA_SATISK6 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK6)
                    };

                    itemSlip.Kalems.Add(kalem);
                }

                itemSlip.EIrsEkBilgi = request.EWaybillInfo;

                var resultDocument = InvoiceManager.PostInternal(itemSlip);

                if (resultDocument.IsSuccessful)
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
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = eDocumentResult.ErrorDesc });
                    }
                }
                else
                {
                    return Json(new { success = false, errorMessage = resultDocument.ErrorDesc });
                }
            }

            return Json(new { success = true });
        }

        //private async Task belgeKaydet(Firm firm, (List<ToplamaKayitModel> ToplamaKayitlari, List<NfSeriTempModel> Seriler) result)
        //{
        //    oAuth2 auth2 = new oAuth2(firm.NetsisRestApiUrl);
        //    var token = await auth2.LoginAsync(new JLogin()
        //    {
        //        BranchCode = firm.NetsisBranchCode,
        //        DbName = firm.NetsisDbName,
        //        DbPassword = "",
        //        DbType = JNVTTipi.vtMSSQL,
        //        DbUser = "TEMELSET",
        //        NetsisUser = firm.NetsisUser,
        //        NetsisPassword = firm.NetsisPassword
        //    });

        //    var num5 = 1;
        //    var num6 = 1;
        //    while (num6 <= num5)
        //    {

        //    }

        //    foreach (var item in result.ToplamaKayitlari)
        //    {
        //        ItemSlipsManager InvoiceManager = new ItemSlipsManager(auth2);
        //        var fatNo = InvoiceManager.NewEWaybillNumber(new NetOpenX.Rest.Client.Model.Custom.ItemSlipsCodeParam()
        //        {
        //            DocumentType = JTFaturaTip.ftSIrs,
        //            Code = firm.EIRSSeri
        //        });

        //        ItemSlips itemSlip = new ItemSlips();
        //        itemSlip.FaturaTip = JTFaturaTip.ftSIrs;
        //        itemSlip.SeriliHesapla = false;
        //        itemSlip.OtomatikCevrimYapilsin = false;
        //        itemSlip.KosulluHesapla = false;
        //        itemSlip.SeriliHesapla = false;
        //        itemSlip.KayitliNumaraOtomatikGuncellensin = false;
        //        itemSlip.SonNumaraYazilsin = false;
        //        itemSlip.FiyatSistemineGoreHesapla = false;
        //        itemSlip.FatUst = new ItemSlipsHeader()
        //        {
        //            FATIRS_NO = fatNo.Data,
        //            CariKod = item.TESLIM_CARI,
        //            Tarih = DateTime.Now,
        //            SIPARIS_TEST = DateTime.Now,
        //            FIYATTARIHI = DateTime.Now,
        //            FiiliTarih = DateTime.Now,
        //            ENTEGRE_TRH = DateTime.Now,
        //            EIrsaliye = true,
        //            GEN_ISK1O = item.GENEL_ISKONTO1 != null ? Convert.ToDouble(item.GENEL_ISKONTO1) : null,
        //            GEN_ISK2O = item.GENEL_ISKONTO2 != null ? Convert.ToDouble(item.GENEL_ISKONTO2) : null,
        //            GEN_ISK3O = item.GENEL_ISKONTO3 != null ? Convert.ToDouble(item.GENEL_ISKONTO3) : null,
        //        };

        //        itemSlip.Kalems = new List<ItemSlipLines>();
        //        foreach (var item in result.ToplamaKayitlari)
        //        {
        //            itemSlip.Kalems.Add(new ItemSlipLines()
        //            {
        //                STra_SIPNUM = item.SIPARIS_NO,
        //                STra_SIPKONT = item.SIPARIS_SIRA,
        //                Olcubr = item.OLCU_BIRIM_KODU,
        //                STra_GCMIK = item.OLCU_BIRIM_CARPANI == null ? seri.MIKTAR : new Decimal(Math.Round(seri.MIKTAR * seri.OLCU_BIRIM_CARPANI, 8)),
        //                StokKodu = item.STOK_KODU,
        //                STra_BF = item.BRUT_FIYAT != null ? Convert.ToDouble(item.BRUT_FIYAT) : 0,
        //                STra_NF = item.NET_FIYAT != null ? Convert.ToDouble(item.NET_FIYAT) : 0,
        //                STra_DOVTIP = string.IsNullOrEmpty(item.DOVIZ_TIPI) ? null : Convert.ToInt32(item.DOVIZ_TIPI),
        //                STra_DOVFIAT = item.DOVIZ_FIYATI != null ? Convert.ToDouble(item.DOVIZ_FIYATI) : null,
        //                Isk_Flag = item.ISKONTO1_ORANMI ? JTFatKalemIskTipi.fkitOran : JTFatKalemIskTipi.fkitTutar,
        //                STra_SatIsk = item.ISK1 != null ? Convert.ToDouble(item.ISK1) : null,
        //                STra_SatIsk2 = item.ISK2 != null ? Convert.ToDouble(item.ISK2) : null,
        //                STra_SatIsk3 = item.ISK3 != null ? Convert.ToDouble(item.ISK3) : null,
        //                STra_SatIsk4 = item.ISK4 != null ? Convert.ToDouble(item.ISK4) : null,
        //                STra_SatIsk5 = item.ISK5 != null ? Convert.ToDouble(item.ISK5) : null,
        //                STra_SatIsk6 = item.ISK6 != null ? Convert.ToDouble(item.ISK6) : null,
        //                SatirBaziAciks = new List<string>() { },
        //                STra_KDV = item.KDV != null ? Convert.ToDouble(item.KDV) : 0,
        //                STra_CARI_KOD = item.TESLIM_CARI,
        //                Ambarkabulno = item.INCKEYNO.ToString(),
        //                YapKod = seri.YAPKOD,
        //                KalemSeri = new List<ItemSlipLineSeries>()
        //                {
        //                   new ItemSlipLineSeries()
        //                   {
        //                       Seri1 = seri.SERI,
        //                       Seri2 = seri.SERI2,
        //                       Seri3 = seri.SERI3,
        //                       Seri4 = seri.SERI4,
        //                       Aciklama1 = seri.ACIKLAMA1,
        //                       Aciklama2 = seri.ACIKLAMA2,
        //                       ACIKLAMA3 = seri.ACIKLAMA3,
        //                       Aciklama4 = seri.ACIKLAMA4,
        //                       Miktar = seri.MIKTAR,
        //                       HareketTip=1,
        //                       SonKulTar = seri.SON_KULLANMA_TARIHI,
        //                   }
        //                },
        //                STra_GC = seri.GC,
        //                STra_TAR = seri.SON_KULLANMA_TARIHI,
        //                STra_ACIK = item.SIPARIS_NO,
        //            });
        //        }

        //        itemSlip.EIrsEkBilgi = request.EWaybillInfo;

        //        var documentResult = InvoiceManager.PostInternal(itemSlip);
        //    }
        //}

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> CreateInvoiceAsync([FromBody] DocumentRequestModel request)
        {
            if (string.IsNullOrEmpty(request.DocumentNumber))
            {
                return Json(new { success = false, errorMessage = "Belge numarası boş olamaz." });
            }

            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

            var shipmentService = new ShipmentManager(con);
            var shipments = await shipmentService.GetShipmentManagementsByDocumentNumbersAsync(request.SevkEmirNumaralari);

            foreach (var shipment in shipments)
            {
                var order = await shipmentService.GetOrderDetailsAsync(shipment.SIPARIS_NO);
                if (order == null)
                {
                    return Json(new { success = false, errorMessage = "Sipariş bilgileri alınamadı." });
                }

                var shipmentLines = await shipmentService.GetShipmentOrderLinesAsync(shipment.BELGE_NO);

                oAuth2 auth2 = new oAuth2(firm.NetsisRestApiUrl);
                var token = await auth2.LoginAsync(new JLogin()
                {
                    BranchCode = firm.NetsisBranchCode,
                    DbName = firm.NetsisDbName,
                    DbPassword = "",
                    DbType = JNVTTipi.vtMSSQL,
                    DbUser = "TEMELSET",
                    NetsisUser = firm.NetsisUser,
                    NetsisPassword = firm.NetsisPassword
                });

                ItemSlipsManager InvoiceManager = new ItemSlipsManager(auth2);

                string fatNo = string.Empty;
                if (request.EInovice)
                {
                    var fatNoResult = InvoiceManager.NewNumber(new NetOpenX.Rest.Client.Model.Custom.ItemSlipsCodeParam()
                    {
                        DocumentType = JTFaturaTip.ftSFat,
                        Code = firm.EFATSeri
                    });
                    fatNo = fatNoResult.Data.ToString();
                }
                else
                {
                    var fatNoResult = InvoiceManager.NewEArchiveNumber(firm.EARSSeri);
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
                        STra_SatIsk6 = shipmentLine.STRA_SATISK6 == null ? null : Convert.ToDouble(shipmentLine.STRA_SATISK6)
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
        public async Task<IActionResult> DocumentView(string documentNumber, bool einvoice, string documentType)
        {
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            oAuth2 auth2 = new oAuth2(firm.NetsisRestApiUrl);
            var token = await auth2.LoginAsync(new JLogin()
            {
                BranchCode = firm.NetsisBranchCode,
                DbName = firm.NetsisDbName,
                DbPassword = "",
                DbType = JNVTTipi.vtMSSQL,
                DbUser = "TEMELSET",
                NetsisUser = firm.NetsisUser,
                NetsisPassword = firm.NetsisPassword
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
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

            var manager = new ShipmentManager(con);
            var list = await manager.GetCustomersAsync();

            return Json(list);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Satış,Sevkiyat")]
        public async Task<IActionResult> ShipmentTemplateList()
        {
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                return NotFound("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

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
                var firm = _db.Firms.FirstOrDefault();
                if (firm == null)
                {
                    return NotFound("Firma bilgileri bulunamadı.");
                }
                using var con = CreateNetsisConnection(firm);

                var shipmentManager = new ShipmentManager(con);
                var result = await shipmentManager.DeleteShipmentAsync(request.DocumentNumber);

                return Json(new { success = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }


        private SqlConnection CreateNetsisConnection(Firm firm)
        {
            var config = new NetsisConfig
            {
                Server = firm.NetsisDbServer,
                Database = firm.NetsisDbName,
                User = firm.NetsisDbUser,
                Password = firm.NetsisDbPassword,
                ApplicationName = firm.NetsisApplicationName,
            };

            return new NetsisConnection(config).Open();
        }
        private async Task PrepareShipmentOrder()
        {
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                throw new Exception("Firma bilgileri bulunamadı.");
            }

            using var con = CreateNetsisConnection(firm);
            var manager = new ShipmentManager(con);

            ViewBag.Warehouses = (await manager.GetWarehousesAsync()).ToList();
            ViewBag.CreateShipmentForMultipleOrders = _db.Settings.Where(s => s.Key == "CreateShipmentForMultipleOrders").Select(s => s.Value).FirstOrDefault();
        }
        private async Task PrepareShipmentCreate(ShipmentRequestModel request, ShipmentModel model)
        {
            var firm = _db.Firms.FirstOrDefault();
            if (firm == null)
            {
                throw new Exception("Firma bilgileri bulunamadı.");
            }
            using var con = CreateNetsisConnection(firm);

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
