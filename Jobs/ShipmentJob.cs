using NetOpenX.Rest.Client;
using NetOpenX.Rest.Client.BLL;
using NetOpenX.Rest.Client.Model;
using NetOpenX.Rest.Client.Model.Enums;
using NetOpenX.Rest.Client.Model.NetOpenX;
using Quartz;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Data;
using TenderFlow.Netsis;

namespace TenderFlow.Jobs
{
    [DisallowConcurrentExecution]
    public class ShipmentJob : ScopedJob
    {
        private readonly TenderFlowContext _context;
        public ShipmentJob(TenderFlowContext context)
        {
            _context = context;
        }

        public override async Task Execute(IJobExecutionContext context)
        {
            try
            {
                Console.WriteLine("ShipmentJob başladı");
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

                var list = await shipmentManager.GetShipmentManagementsAsync(status: 4);
                return;
                if (list.Any())
                {
                    foreach (var shipment in list)
                    {
                        var shipmentLines = await shipmentManager.GetShipmentLinesAsync(shipment.BELGE_NO);

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
                            FiiliTarih  = DateTime.Now,
                            DovBazTarihi = DateTime.Now,
                            EIrsaliye = true,
                            

                        };

                        itemSlip.Kalems = new List<ItemSlipLines>();
                        foreach (var shipmentLine in shipmentLines)
                        {
                            itemSlip.Kalems.Add(new ItemSlipLines()
                            {
                                StokKodu = shipmentLine.STOKKODU,
                                DEPO_KODU = shipmentLine.DEPO,
                                STra_GCMIK = Convert.ToDouble(shipmentLine.MIKTAR),
                                STra_SIPNUM = shipmentLine.SIPNO,
                                Sira = shipmentLine.SIRA
                            });
                        }

                        var result = InvoiceManager.PostInternal(itemSlip);
                        if (result != null)
                        {
                            if (result.IsSuccessful)
                            {
                                ActivityLog activityLog = new ActivityLog();
                                activityLog.ActivityLogType = "İrsaliye Oluşturma";
                                activityLog.UserId = null;
                                activityLog.Comment = result.Message;
                                activityLog.CreatedOn = DateTime.Now;

                                _context.ActivityLogs.Add(activityLog);
                                await _context.SaveChangesAsync();

                                EDocumentManager EDocumentManager = new EDocumentManager(auth2);
                                EDocument eDocument = new EDocument();

                                eDocument.Tip = JTEBelgeTip.ebtEIrs;
                                eDocument.BelgeNo = fatNo.Data.ToString();
                                eDocument.DizaynKontrol = false;

                                var eDocumentResult = EDocumentManager.PostInternal(eDocument);
                                if (eDocumentResult.IsSuccessful)
                                {
                                    ActivityLog activityLogEBelge = new ActivityLog();
                                    activityLogEBelge.ActivityLogType = "İrsaliye E-Belge Oluşturma";
                                    activityLogEBelge.UserId = null;
                                    activityLogEBelge.Comment = "İrsaliye başarılı bir şekilde oluşturuldu. Belge No:" + fatNo.Data.ToString();
                                    activityLogEBelge.CreatedOn = DateTime.Now;

                                    _context.ActivityLogs.Add(activityLogEBelge);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    ActivityLog activityLogEBelge = new ActivityLog();
                                    activityLogEBelge.ActivityLogType = "İrsaliye E-Belge Oluşturma Hata";
                                    activityLogEBelge.UserId = null;
                                    activityLogEBelge.Comment = result.ErrorCode + " " + result.ErrorDesc;
                                    activityLogEBelge.CreatedOn = DateTime.Now;

                                    _context.ActivityLogs.Add(activityLogEBelge);
                                    await _context.SaveChangesAsync();
                                }
                            }
                            else
                            {
                                ActivityLog activityLog = new ActivityLog();
                                activityLog.ActivityLogType = "İrsaliye Oluşturma Hata";
                                activityLog.UserId = null;
                                activityLog.Comment = result.ErrorCode + " " + result.ErrorDesc;
                                activityLog.CreatedOn = DateTime.Now;

                                _context.ActivityLogs.Add(activityLog);
                                await _context.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            ActivityLog activityLog = new ActivityLog();
                            activityLog.ActivityLogType = "İrsaliye Oluşturma Hata";
                            activityLog.UserId = null;
                            activityLog.Comment = "Bilinmeyen bir hata oluştu";
                            activityLog.CreatedOn = DateTime.Now;

                            _context.ActivityLogs.Add(activityLog);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
                else
                {
                    Console.WriteLine("İşlenecek kayıt bulunamadı");
                }

                Console.WriteLine("ShipmentJob tamamlandı");
            }
            catch (Exception ex)
            {

                Console.WriteLine("ShipmentJob Hata :" + ex.ToString());
                ActivityLog activityLog = new ActivityLog();
                activityLog.ActivityLogType = "İrsaliye Oluşturma Hata";
                activityLog.UserId = null;
                activityLog.Comment = ex.ToString();
                activityLog.CreatedOn = DateTime.Now;

                _context.ActivityLogs.Add(activityLog);
                await _context.SaveChangesAsync();
            }
        }
    }
}
