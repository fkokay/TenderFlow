using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ShipmentOrderModel
    {
        public int ID { get; set; }
        public string SIPARIS_NO { get; set; } = string.Empty;
        public int SIRA { get; set; }
        public string CARI_KODU { get; set; } = string.Empty;
        public string CARI_ADI { get; set; } = string.Empty;
        public string TESLIM_CARI_KODU { get; set; } = string.Empty;
        public string TESLIM_CARI_ADI { get; set; } = string.Empty;
        public DateTime TARIH { get; set; }
        public DateTime? TESLIM_TARIHI { get; set; }
        public string STOK_KODU { get; set; } = string.Empty;
        public string STOK_ADI { get; set; } = string.Empty;
        public string YAPKOD { get; set; } = string.Empty;
        public string YAPACIK { get; set; } = string.Empty;
        public decimal SIPARIS_MIKTAR { get; set; }
        public decimal GONDERILEN_MIKTAR { get; set; }
        public decimal MIKTAR { get; set; }
        public string DEPO_KODU { get; set; } = string.Empty;
        public string DEPO_TANIMI { get; set; } = string.Empty;
        public string PROJE_KODU { get; set; } = string.Empty;
        public string EKALAN1 { get; set; } = string.Empty;
        public string EKALAN2 { get; set; } = string.Empty;
        public decimal DEPO_BAKIYE { get; set; }
        public string ACIKLAMA { get; set; } = string.Empty;
        public string ACIKLAMA1 { get; set; } = string.Empty;
        public string ACIKLAMA2 { get; set; } = string.Empty;
        public string ACIKLAMA3 { get; set; } = string.Empty;
        public string ACIKLAMA4 { get; set; } = string.Empty;
        public string ACIKLAMA5 { get; set; } = string.Empty;
        public string ACIKLAMA6 { get; set; } = string.Empty;
        public string ACIKLAMA7 { get; set; } = string.Empty;
        public string ACIKLAMA8 { get; set; } = string.Empty;
        public string ACIKLAMA9 { get; set; } = string.Empty;
        public string ACIKLAMA10 { get; set; } = string.Empty;
        public string ACIKLAMA11 { get; set; } = string.Empty;
        public string ACIKLAMA12 { get; set; } = string.Empty;
        public string ACIKLAMA13 { get; set; } = string.Empty;
        public string ACIKLAMA14 { get; set; } = string.Empty;
        public string ACIKLAMA15 { get; set; } = string.Empty;
        public string ACIKLAMA16 { get; set; } = string.Empty;
        public string KOSUL_KODU { get; set; } = string.Empty;
        public decimal? BIRIM_AGIRLIK { get; set; }
        public decimal? TOPLAM_AGIRLIK { get; set; }
        public string STOK_GRUP_TANIMI { get; set; } = string.Empty;
        public string STOK_KOD1_TANIMI { get; set; } = string.Empty;
        public string STOK_KOD2_TANIMI { get; set; } = string.Empty;
        public string STOK_KOD3_TANIMI { get; set; } = string.Empty;
        public string STOK_KOD4_TANIMI { get; set; } = string.Empty;
        public string STOK_KOD5_TANIMI { get; set; } = string.Empty;
        public decimal? STOK_KULL1N { get; set; }
        public string STOK_KULL1S { get; set; } = string.Empty;
        public decimal? STOK_KULL2N { get; set; }
        public string STOK_KULL2S { get; set; } = string.Empty;
        public decimal? STOK_KULL3N { get; set; }
        public string STOK_KULL3S { get; set; } = string.Empty;
        public decimal? STOK_KULL4N { get; set; }
        public string STOK_KULL4S { get; set; } = string.Empty;
        public decimal? STOK_KULL5N { get; set; }
        public string STOK_KULL5S { get; set; } = string.Empty;
        public decimal? STOK_KULL6N { get; set; }
        public string STOK_KULL6S { get; set; } = string.Empty;
        public decimal? STOK_KULL7N { get; set; }
        public string STOK_KULL7S { get; set; } = string.Empty;
        public decimal? STOK_KULL8N { get; set; }
        public string STOK_KULL8S { get; set; } = string.Empty;
        public string INGILIZCE_ISIM { get; set; } = string.Empty;
        public string CARI_IL { get; set; } = string.Empty;
        public string CARI_ILCE { get; set; } = string.Empty;
        public string CARI_GRUP_TANIMI { get; set; } = string.Empty;
        public string CARI_KOD1_TANIMI { get; set; } = string.Empty;
        public string CARI_KOD2_TANIMI { get; set; } = string.Empty;
        public string CARI_KOD3_TANIMI { get; set; } = string.Empty;
        public string CARI_KOD4_TANIMI { get; set; } = string.Empty;
        public string CARI_KOD5_TANIMI { get; set; } = string.Empty;
        public decimal? CARI_KULL1N { get; set; }
        public string CARI_KULL1S { get; set; } = string.Empty;
        public decimal? CARI_KULL2N { get; set; }
        public string CARI_KULL2S { get; set; } = string.Empty;
        public decimal? CARI_KULL3N { get; set; }
        public string CARI_KULL3S { get; set; } = string.Empty;
        public decimal? CARI_KULL4N { get; set; }
        public string CARI_KULL4S { get; set; } = string.Empty;
        public decimal? CARI_KULL5N { get; set; }
        public string CARI_KULL5S { get; set; } = string.Empty;
        public decimal? CARI_KULL6N { get; set; }
        public string CARI_KULL6S { get; set; } = string.Empty;
        public decimal? CARI_KULL7N { get; set; }
        public string CARI_KULL7S { get; set; } = string.Empty;
        public decimal? CARI_KULL8N { get; set; }
        public string CARI_KULL8S { get; set; } = string.Empty;
        public string PLASIYER_KODU { get; set; } = string.Empty;
        public string PLASIYER_ADI { get; set; } = string.Empty;
        public bool SECIM { get; set; }
    }
}
