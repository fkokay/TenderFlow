using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ShipmentOrderModel
    {
        public int ID { get; set; }
        public string SIPARIS_NO { get; set; }
        public int SIRA { get; set; }
        public string CARI_KODU { get; set; }
        public string CARI_ADI { get; set; }
        public string TESLIM_CARI_KODU { get; set; }
        public string TESLIM_CARI_ADI { get; set; }

        public DateTime TARIH { get; set; }
        public DateTime? TESLIM_TARIHI { get; set; }

        public string STOK_KODU { get; set; }
        public string STOK_ADI { get; set; }

        public string YAPKOD { get; set; }
        public string YAPACIK { get; set; }

        public decimal SIPARIS_MIKTAR { get; set; }
        public decimal GONDERILEN_MIKTAR { get; set; }
        public decimal MIKTAR { get; set; }

        public string DEPO_KODU { get; set; }
        public string DEPO_TANIMI { get; set; }

        public string PROJE_KODU { get; set; }
        public string EKALAN1 { get; set; }
        public string EKALAN2 { get; set; }

        public decimal DEPO_BAKIYE { get; set; }

        public string ACIKLAMA { get; set; }
        public string ACIKLAMA1 { get; set; }
        public string ACIKLAMA2 { get; set; }
        public string ACIKLAMA3 { get; set; }
        public string ACIKLAMA4 { get; set; }
        public string ACIKLAMA5 { get; set; }
        public string ACIKLAMA6 { get; set; }
        public string ACIKLAMA7 { get; set; }
        public string ACIKLAMA8 { get; set; }
        public string ACIKLAMA9 { get; set; }
        public string ACIKLAMA10 { get; set; }
        public string ACIKLAMA11 { get; set; }
        public string ACIKLAMA12 { get; set; }
        public string ACIKLAMA13 { get; set; }
        public string ACIKLAMA14 { get; set; }
        public string ACIKLAMA15 { get; set; }
        public string ACIKLAMA16 { get; set; }

        public string KOSUL_KODU { get; set; }

        public decimal? BIRIM_AGIRLIK { get; set; }
        public decimal? TOPLAM_AGIRLIK { get; set; }

        public string STOK_GRUP_TANIMI { get; set; }
        public string STOK_KOD1_TANIMI { get; set; }
        public string STOK_KOD2_TANIMI { get; set; }
        public string STOK_KOD3_TANIMI { get; set; }
        public string STOK_KOD4_TANIMI { get; set; }
        public string STOK_KOD5_TANIMI { get; set; }

        public decimal? STOK_KULL1N { get; set; }
        public string STOK_KULL1S { get; set; }
        public decimal? STOK_KULL2N { get; set; }
        public string STOK_KULL2S { get; set; }
        public decimal? STOK_KULL3N { get; set; }
        public string STOK_KULL3S { get; set; }
        public decimal? STOK_KULL4N { get; set; }
        public string STOK_KULL4S { get; set; }
        public decimal? STOK_KULL5N { get; set; }
        public string STOK_KULL5S { get; set; }
        public decimal? STOK_KULL6N { get; set; }
        public string STOK_KULL6S { get; set; }
        public decimal? STOK_KULL7N { get; set; }
        public string STOK_KULL7S { get; set; }
        public decimal? STOK_KULL8N { get; set; }
        public string STOK_KULL8S { get; set; }

        public string INGILIZCE_ISIM { get; set; }

        public string CARI_IL { get; set; }
        public string CARI_ILCE { get; set; }

        public string CARI_GRUP_TANIMI { get; set; }
        public string CARI_KOD1_TANIMI { get; set; }
        public string CARI_KOD2_TANIMI { get; set; }
        public string CARI_KOD3_TANIMI { get; set; }
        public string CARI_KOD4_TANIMI { get; set; }
        public string CARI_KOD5_TANIMI { get; set; }

        public decimal? CARI_KULL1N { get; set; }
        public string CARI_KULL1S { get; set; }
        public decimal? CARI_KULL2N { get; set; }
        public string CARI_KULL2S { get; set; }
        public decimal? CARI_KULL3N { get; set; }
        public string CARI_KULL3S { get; set; }
        public decimal? CARI_KULL4N { get; set; }
        public string CARI_KULL4S { get; set; }
        public decimal? CARI_KULL5N { get; set; }
        public string CARI_KULL5S { get; set; }
        public decimal? CARI_KULL6N { get; set; }
        public string CARI_KULL6S { get; set; }
        public decimal? CARI_KULL7N { get; set; }
        public string CARI_KULL7S { get; set; }
        public decimal? CARI_KULL8N { get; set; }
        public string CARI_KULL8S { get; set; }

        public string PLASIYER_KODU { get; set; }
        public string PLASIYER_ADI { get; set; }
        public bool SECIM { get; set; }
    }
}
