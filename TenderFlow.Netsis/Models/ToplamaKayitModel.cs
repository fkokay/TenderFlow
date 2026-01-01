using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ToplamaKayitModel
    {
        public int INCKEYNO { get; set; }

        public string BELGE_NO { get; set; }

        public string TESLIM_CARI { get; set; }
        public string TESLIM_CARI2 { get; set; }

        public string SIPARIS_NO { get; set; }
        public int SIPARIS_SIRA { get; set; }

        public int? SIPINCKEY { get; set; }
        public string PLASIYER_KODU { get; set; }

        public string STOK_KODU { get; set; }
        public string STOK_ADI { get; set; }

        public string YAPKOD { get; set; }
        public string YAPACIK { get; set; }

        public decimal MIKTAR { get; set; }
        public decimal? SIPARIS_MIKTARI { get; set; }
        public decimal? MAL_FAZLASI { get; set; }

        public string DEPO_KODU { get; set; }

        public decimal? NET_FIYAT { get; set; }
        public decimal? BRUT_FIYAT { get; set; }

        public string DOVIZ_TIPI { get; set; }
        public decimal? DOVIZ_FIYATI { get; set; }

        public decimal? KDV { get; set; }

        public string PROJE_KODU { get; set; }

        public string KOSUL_KODU { get; set; }
        public DateTime? KOSUL_TARIHI { get; set; }

        public string OZEL_KOD1 { get; set; }
        public string OZEL_KOD2 { get; set; }

        public string GENISK1_TIPI { get; set; }
        public string GENISK2_TIPI { get; set; }
        public string GENISK3_TIPI { get; set; }

        public decimal? GENEL_ISKONTO1 { get; set; }
        public decimal? GENEL_ISKONTO2 { get; set; }
        public decimal? GENEL_ISKONTO3 { get; set; }

        public bool ISKONTO1_ORANMI { get; set; }

        public decimal? ISK1 { get; set; }
        public decimal? ISK2 { get; set; }
        public decimal? ISK3 { get; set; }
        public decimal? ISK4 { get; set; }
        public decimal? ISK5 { get; set; }
        public decimal? ISK6 { get; set; }

        public string ISK1_TIPI { get; set; }
        public string ISK2_TIPI { get; set; }
        public string ISK3_TIPI { get; set; }
        public string ISK4_TIPI { get; set; }
        public string ISK5_TIPI { get; set; }
        public string ISK6_TIPI { get; set; }

        /// <summary>
        /// CASE WHEN ... THEN 'E' ELSE 'H'
        /// </summary>
        public string STOK_ADI_DEGISTI { get; set; }

        public string EKALAN1 { get; set; }
        public string EKALAN2 { get; set; }

        public int? OLCU_BIRIM_KODU { get; set; }
        public decimal? OLCU_BIRIM_CARPANI { get; set; }

        public int? SIPARIS_VADE_GUNU { get; set; }
        public DateTime? SIPARIS_VADE_TARIHI { get; set; }
    }

}
