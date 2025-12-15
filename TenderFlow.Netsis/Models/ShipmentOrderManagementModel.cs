using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ShipmentOrderManagementModel
    {
        public string BELGE_NO { get; set; }

        public DateTime TARIH { get; set; }
        public DateTime? SEVKTARIHI { get; set; }

        public string DURUM_ACIKLAMA { get; set; }
        public string KULLANICI_ADSOYAD { get; set; }

        public decimal TOPLAM_MIKTAR { get; set; }
        public decimal TOPLAM_TOPLANAN { get; set; }
        public decimal TOPLAM_KALAN { get; set; }
        public decimal TOPLAM_IRS_EDILEN { get; set; }
        public decimal TOPLAM_IRS_EDILMEYEN { get; set; }

        public string? ACIK1 { get; set; }
        public string? ACIK2 { get; set; }
        public string? ACIK3 { get; set; }
        public string? ACIK4 { get; set; }
        public string? ACIK5 { get; set; }
        public string? ACIK6 { get; set; }
        public string? ACIK7 { get; set; }
        public string? ACIK8 { get; set; }
        public string? ACIK9 { get; set; }
        public string? ACIK10 { get; set; }

        public string CARI_KODU { get; set; }
        public string CARI_ADI { get; set; }
        public string? KAPALI { get; set; }          // Netsis genelde 'E' / 'H'
        public string? KISMI_TESLIMAT { get; set; }  // yine 'E' / 'H' beklerim

        public string? GRUP_TANIMI { get; set; }
        public string? KOD1_TANIMI { get; set; }
        public string? KOD2_TANIMI { get; set; }
        public string? KOD3_TANIMI { get; set; }
        public string? KOD4_TANIMI { get; set; }
        public string? KOD5_TANIMI { get; set; }
        public string SIFIR_FIYAT_VAR { get; set; } = string.Empty;

        public string SIPARIS_NO { get; set; } = string.Empty;

        public decimal? CARI_KULL1N { get; set; }
        public decimal? CARI_KULL2N { get; set; }
        public decimal? CARI_KULL3N { get; set; }
        public decimal? CARI_KULL4N { get; set; }
        public decimal? CARI_KULL5N { get; set; }
        public decimal? CARI_KULL6N { get; set; }
        public decimal? CARI_KULL7N { get; set; }
        public decimal? CARI_KULL8N { get; set; }

        public string? CARI_KULL1S { get; set; }
        public string? CARI_KULL2S { get; set; }
        public string? CARI_KULL3S { get; set; }
        public string? CARI_KULL4S { get; set; }
        public string? CARI_KULL5S { get; set; }
        public string? CARI_KULL6S { get; set; }
        public string? CARI_KULL7S { get; set; }
        public string? CARI_KULL8S { get; set; }

        public string EFATURA_CARISI { get; set; } = string.Empty;
    }
}
