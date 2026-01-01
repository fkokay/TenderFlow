using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ClsBelge
    {
        public class Fatura
        {
            public Fatura()
            {
                this.BelgeNumarasi = string.Empty;
                this.CariKodu = string.Empty;
                this.CariSiparisBaglantisi = true;
                this.BelgeTarihi = DateTime.Now.Date;
                this.EIRSALIYEMI = false;
                this.ProjeKodu = null;
                this.KosulKodu = null;
                this.KosulTarihi = new DateTime?();
                this.PlasiyerKodu = string.Empty;
                this.Aciklama = string.Empty;
                this.Kalemler = new List<Kalem>();
                this.Paketler = new List<ClsPaket>();
                this.PaketBelgeTipi = string.Empty;
                this.PaketBelgeNumarasi = string.Empty;
                this.BelgeNumarasindanPaketKapat = false;
                this.BelgeTipi = ~Enumlar.EBelgeTipi.AlisIrsaliyesi;
                this.IthalatIhracat = new bool?();
                this.GirisDepoKodu = -1;
                this.CikisDepoKodu = -1;
                this.HucreHareketiYap = true;
                this.HucreKarsiGirisHareketi = true;
                this.SonHata = null;
                this.MasrafKodu = string.Empty;
                this.KayitOncesiSorgu = string.Empty;
                this.KayitSonrasiSorgu = string.Empty;
                this.listeSevkEmri = null;
                this.EkAciklama = null;
                this.EIrsEkBilgiModel = null;
                this.AciklamaDuzeltmeyiAtla = false;
                this.KayitliNumaraOtomatikGuncellensin = true;
            }

            public bool AciklamaDuzeltmeyiAtla { get; set; }
            public bool KayitliNumaraOtomatikGuncellensin { get; set; }
            public string BelgeNumarasi { get; set; }
            public string CariKodu { get; set; }
            public bool CariSiparisBaglantisi { get; set; }
            public DateTime BelgeTarihi { get; set; }
            public bool EIRSALIYEMI { get; set; }
            public string? ProjeKodu { get; set; }
            public string? KosulKodu { get; set; }
            public DateTime? KosulTarihi { get; set; }
            public string PlasiyerKodu { get; set; }
            public string Aciklama { get; set; }
            public List<Kalem> Kalemler { get; set; }
            public List<ClsPaket> Paketler { get; set; }
            public string PaketBelgeTipi { get; set; }
            public string PaketBelgeNumarasi { get; set; }
            public bool BelgeNumarasindanPaketKapat { get; set; }
            public Enumlar.EBelgeTipi BelgeTipi { get; set; }
            public bool? IthalatIhracat { get; set; }
            public int GirisDepoKodu { get; set; }
            public int CikisDepoKodu { get; set; }
            public bool HucreHareketiYap { get; set; }
            public bool HucreKarsiGirisHareketi { get; set; }
            public Exception? SonHata { get; set; }
            public string MasrafKodu { get; set; }
            public int CikisYeri { get; set; }
            public string KayitOncesiSorgu { get; set; }
            public string KayitSonrasiSorgu { get; set; }
            public List<string> listeSevkEmri { get; set; }
            public ClsNetsisAciklama EkAciklama { get; set; }
            public decimal? Isk1O { get; set; }
            public decimal? Isk2O { get; set; }
            public decimal? Isk3O { get; set; }
            public decimal Isk1Tipi { get; set; }
            public decimal Isk2Tipi { get; set; }
            public decimal Isk3Tipi { get; set; }
            public string KasaKodu { get; set; }
            public int EFaturaOzelKod { get; set; }
            public decimal EkMaliyet1Tutari { get; set; }
            public decimal EkMaliyet2Tutari { get; set; }
            public decimal EkMaliyet3Tutari { get; set; }
            public string OdemeKodu { get; set; }
            public decimal F_YEDEK4 { get; set; }
            public ClsEIrsaliyeSevkBilgi EIrsEkBilgiModel { get; set; }

            public class Kalem
            {
                private int _GirisDepoKodu;
                private int _CikisDepoKodu;
                private DateTime? _Tarih;

                public Fatura Belge { get; set; }

                public Kalem(Fatura Belge)
                {
                    this.Belge = Belge;
                    this.StokKodu = string.Empty;
                    this.StokAdi = string.Empty;
                    this.YapKodu = string.Empty;
                    this.YapAcik = string.Empty;
                    this._GirisDepoKodu = -1;
                    this._CikisDepoKodu = -1;
                    this._Tarih = new DateTime?();
                    this.Miktar = 0.0;
                    this.Miktar_MF = 0.0;
                    this.OlcuBirimCarpani = 0.0;
                    this.NetFiyat = new double?();
                    this.BrutFiyat = new double?();
                    this.DovizTipi = new int?();
                    this.DovizFiyati = new double?();
                    this.Isk1 = new double?();
                    this.Isk2 = new double?();
                    this.Isk3 = new double?();
                    this.Isk4 = new double?();
                    this.Isk5 = new double?();
                    this.Isk6 = new double?();
                    this.Isk1OranMi = new bool?();
                    this.Kdv = new double?();
                    this.ID = -1;
                    this.IrsaliyeNo = string.Empty;
                    this.SiparisNo = string.Empty;
                    this.SiparisSira = -1;
                    this.SiparisINCKeyNo = -1;
                    this.HucreKodu = string.Empty;
                    this.IadeFiyati = 0.01;
                    this.AmbarNumarasi = -1;
                    this.TeslimCariKodu = string.Empty;
                    this.PaketID = -1;
                    this.ProjeKodu = null;
                    this.KosulKodu = null;
                    this.seriLotListe = new List<SeriLot>();
                    this.EkAlan1 = null;
                    this.EkAlan2 = null;
                }

                public string StokKodu { get; set; }

                public string StokAdi { get; set; }

                public string YapKodu { get; set; }

                public string YapAcik { get; set; }

                public int GirisDepoKodu
                {
                    get => this._GirisDepoKodu >= 0 ? this._GirisDepoKodu : this.Belge.GirisDepoKodu;
                    set => this._GirisDepoKodu = value;
                }

                public int CikisDepoKodu
                {
                    get => this._CikisDepoKodu >= 0 ? this._CikisDepoKodu : this.Belge.CikisDepoKodu;
                    set => this._CikisDepoKodu = value;
                }

                public DateTime Tarih
                {
                    get
                    {
                        return !this._Tarih.HasValue || !this._Tarih.HasValue ? this.Belge.BelgeTarihi : this._Tarih.Value;
                    }
                    set => this._Tarih = new DateTime?(value);
                }

                public double Miktar { get; set; }

                public double Miktar_MF { get; set; }

                public int OlcuBirimKodu { get; set; }

                public double OlcuBirimCarpani { get; set; }

                public int? VadeGunu { get; set; }

                public DateTime? VadeTarihi { get; set; }

                public double? NetFiyat { get; set; }

                public double? BrutFiyat { get; set; }

                public int? DovizTipi { get; set; }

                public double? DovizFiyati { get; set; }

                public double? Isk1 { get; set; }

                public double? Isk2 { get; set; }

                public double? Isk3 { get; set; }

                public double? Isk4 { get; set; }

                public double? Isk5 { get; set; }

                public double? Isk6 { get; set; }

                public bool? Isk1OranMi { get; set; }

                public int Isk1Tipi { get; set; }

                public int Isk2Tipi { get; set; }

                public int Isk3Tipi { get; set; }

                public int Isk4Tipi { get; set; }

                public int Isk5Tipi { get; set; }

                public int Isk6Tipi { get; set; }

                public double? Kdv { get; set; }

                public int ID { get; set; }

                public string IrsaliyeNo { get; set; }

                public string SiparisNo { get; set; }

                public int SiparisSira { get; set; }

                public int SiparisINCKeyNo { get; set; }

                public string HucreKodu { get; set; }

                public double IadeFiyati { get; set; }

                public int AmbarNumarasi { get; set; }

                public string TeslimCariKodu { get; set; }

                public int PaketID { get; set; }

                public string? ProjeKodu { get; set; }

                public string? KosulKodu { get; set; }

                public List<SeriLot> seriLotListe { get; set; }

                public string? EkAlan1 { get; set; }

                public string? EkAlan2 { get; set; }

                public string Aciklama1 { get; set; }

                public string Aciklama2 { get; set; }

                public string Aciklama3 { get; set; }

                public string Aciklama4 { get; set; }

                public string Aciklama5 { get; set; }

                public string Aciklama6 { get; set; }

                public string Aciklama7 { get; set; }

                public string Aciklama8 { get; set; }

                public string Aciklama9 { get; set; }

                public string Aciklama10 { get; set; }

                public string C_YEDEK6 { get; set; }

                public string MuhasebeKodu { get; set; }

                public string MuhReferansKodu { get; set; }

                public int SiraNo()
                {
                    int num1 = checked(this.Belge.Kalemler.Count - 1);
                    int index = 0;
                    int num2;
                    while (index <= num1)
                    {
                        if (this.Belge.Kalemler[index] == this)
                        {
                            num2 = checked(index + 1);
                            goto label_6;
                        }
                        checked { ++index; }
                    }
                    num2 = -1;
                label_6:
                    return num2;
                }

                public Decimal getCevrimliMiktar()
                {
                    return new Decimal(Math.Round(this.Miktar * this.OlcuBirimCarpani, 8));
                }

                public Decimal getMalFazCevrimliMiktar()
                {
                    return new Decimal(Math.Round(this.Miktar_MF * this.OlcuBirimCarpani, 8));
                }

                public string Serialize() => JsonConvert.SerializeObject(this);

                public static ClsBelge? DeSerialize(string JSon)
                {
                    return JsonConvert.DeserializeObject<ClsBelge>(JSon);
                }

                public bool ShouldSerializeBelge() => false;

                public bool ShouldSerializeStokKodu() => !string.IsNullOrEmpty(this.StokKodu);

                public bool ShouldSerializeYapKodu() => !string.IsNullOrEmpty(this.YapKodu);

                public bool ShouldSerializeYapAcik() => !string.IsNullOrEmpty(this.YapAcik);

                public bool ShouldSerializeTarih() => this._Tarih.HasValue && this._Tarih.HasValue;

                public bool ShouldSerializeGirisDepoKodu() => this.GirisDepoKodu >= 0;

                public bool ShouldSerializeCikisDepoKodu() => this.CikisDepoKodu >= 0;

                public bool ShouldSerializeMiktar() => this.Miktar > 0.0;

                public bool ShouldSerializeNetFiyat() => this.NetFiyat.HasValue && this.NetFiyat.HasValue;

                public bool ShouldSerializeBrutFiyat() => this.BrutFiyat.HasValue && this.BrutFiyat.HasValue;

                public bool ShouldSerializeDovizTipi() => this.DovizTipi.HasValue && this.DovizTipi.HasValue;

                public bool ShouldSerializeDovizFiyati()
                {
                    return this.DovizFiyati.HasValue && this.DovizFiyati.HasValue;
                }

                public bool ShouldSerializeIsk1() => this.Isk1.HasValue && this.Isk1.HasValue;

                public bool ShouldSerializeIsk2() => this.Isk2.HasValue && this.Isk2.HasValue;

                public bool ShouldSerializeIsk3() => this.Isk3.HasValue && this.Isk3.HasValue;

                public bool ShouldSerializeIsk4() => this.Isk4.HasValue && this.Isk4.HasValue;

                public bool ShouldSerializeIsk5() => this.Isk5.HasValue && this.Isk5.HasValue;

                public bool ShouldSerializeIsk6() => this.Isk6.HasValue && this.Isk6.HasValue;

                public bool ShouldSerializeKdv() => this.Kdv.HasValue && this.Kdv.HasValue;

                public bool ShouldSerializeID() => this.ID >= 0;

                public bool ShouldSerializeSiparisNo() => !string.IsNullOrEmpty(this.SiparisNo);

                public bool ShouldSerializeSiparisSira() => this.SiparisSira >= 0;

                public bool ShouldSerializeSiparisINCKeyNo() => this.SiparisINCKeyNo >= 0;

                public bool ShouldSerializeHucreKodu() => !string.IsNullOrEmpty(this.HucreKodu);

                public bool ShouldSerializeIadeFiyati() => this.IadeFiyati > 0.0;

                public bool ShouldSerializeAmbarNumarasi() => this.AmbarNumarasi >= 0;

                public bool ShouldSerializeTeslimCariKodu() => !string.IsNullOrEmpty(this.TeslimCariKodu);

                public bool ShouldSerializePaketID() => this.PaketID >= 0;

                public class SeriLot
                {
                    public string stokKodu { get; set; }

                    public string yapKod { get; set; }

                    public string seri { get; set; }

                    public string seri2 { get; set; }

                    public string aciklama1 { get; set; }

                    public string aciklama2 { get; set; }

                    public Decimal miktar { get; set; }

                    public string gc { get; set; }

                    public int? depoKodu { get; set; }

                    public string kayitYapanKul { get; set; }

                    public DateTime? kayitTarihi { get; set; }

                    public string duzeltmeYapanKul { get; set; }

                    public DateTime? duzeltmeTarihi { get; set; }
                }
            }
            public class ClsNetsisAciklama
            {
                public ClsNetsisAciklama()
                {
                    this.ListeOzelKod1 = new List<string>();
                    this.ListeOzelKod2 = new List<string>();
                    this.ListeTeslimCari = new List<string>();
                    this.ListeKdvDahilMi = new List<bool>();
                    this.ListeTipi = new List<int>();
                    this.ListeIthIhrTipi = new List<int>();
                    this.Acik1 = string.Empty;
                    this.Acik2 = string.Empty;
                    this.Acik3 = string.Empty;
                    this.Acik4 = string.Empty;
                    this.Acik5 = string.Empty;
                    this.Acik6 = string.Empty;
                    this.Acik7 = string.Empty;
                    this.Acik8 = string.Empty;
                    this.Acik9 = string.Empty;
                    this.Acik10 = string.Empty;
                    this.Acik11 = string.Empty;
                    this.Acik12 = string.Empty;
                    this.Acik13 = string.Empty;
                    this.Acik14 = string.Empty;
                    this.Acik15 = string.Empty;
                    this.Acik16 = string.Empty;
                    this.OdemeGunu = new int?();
                    this.OdemeTarihi = new DateTime?();
                    this.GenelIskonto1 = new List<Decimal>();
                    this.GenelIskonto2 = new List<Decimal>();
                    this.GenelIskonto3 = new List<Decimal>();
                }

                public List<string> ListeOzelKod1 { get; set; }

                public List<string> ListeOzelKod2 { get; set; }

                public List<string> ListeTeslimCari { get; set; }

                public List<bool> ListeKdvDahilMi { get; set; }

                public List<int> ListeTipi { get; set; }

                public List<int> ListeIthIhrTipi { get; set; }

                public string Acik1 { get; set; }

                public string Acik2 { get; set; }

                public string Acik3 { get; set; }

                public string Acik4 { get; set; }

                public string Acik5 { get; set; }

                public string Acik6 { get; set; }

                public string Acik7 { get; set; }

                public string Acik8 { get; set; }

                public string Acik9 { get; set; }

                public string Acik10 { get; set; }

                public string Acik11 { get; set; }

                public string Acik12 { get; set; }

                public string Acik13 { get; set; }

                public string Acik14 { get; set; }

                public string Acik15 { get; set; }

                public string Acik16 { get; set; }

                public int? OdemeGunu { get; set; }

                public DateTime? OdemeTarihi { get; set; }

                public List<Decimal> GenelIskonto1 { get; set; }

                public List<Decimal> GenelIskonto2 { get; set; }

                public List<Decimal> GenelIskonto3 { get; set; }
            }
            public class ClsEIrsaliyeSevkBilgi
            {
                public string PLAKA { get; set; }

                public DateTime? SEVKTAR { get; set; }

                public string TASIYICI_VKN { get; set; }

                public string TASIYICI_UNVAN { get; set; }

                public string TASIYICI_IL { get; set; }

                public string TASIYICI_ILCE { get; set; }

                public string TASIYICI_ULKE { get; set; }

                public string TASIYICI_POSTAKODU { get; set; }

                public string SOFOR_1_ADI { get; set; }

                public string SOFOR_1_SOYADI { get; set; }

                public string SOFOR_1_ACIKLAMA { get; set; }

                public string SOFOR_1_KIMLIKNO { get; set; }

                public string SOFOR_2_ADI { get; set; }

                public string SOFOR_2_SOYADI { get; set; }

                public string SOFOR_2_ACIKLAMA { get; set; }

                public string SOFOR_2_KIMLIKNO { get; set; }

                public string SOFOR_3_ADI { get; set; }

                public string SOFOR_3_SOYADI { get; set; }

                public string SOFOR_3_ACIKLAMA { get; set; }

                public string SOFOR_3_KIMLIKNO { get; set; }

                public string DORSE_PLAKA1 { get; set; }

                public string DORSE_PLAKA2 { get; set; }

                public string DORSE_PLAKA3 { get; set; }
            }


        }
    }
}
