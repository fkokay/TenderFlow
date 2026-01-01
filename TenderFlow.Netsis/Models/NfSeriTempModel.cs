using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class NfSeriTempModel
    {
        public int ID { get; set; }
        public string? BELGE_TIPI { get; set; }
        public string? BELGE_NO { get; set; }
        public int? REF_ID { get; set; }
        public string STOK_KODU { get; set; } = string.Empty;
        public string? YAPKOD { get; set; }
        public string SERI { get; set; } = string.Empty;
        public string? SERI2 { get; set; }
        public string? SERI3 { get; set; }
        public string? SERI4 { get; set; }
        public string? ACIKLAMA1 { get; set; }
        public string? ACIKLAMA2 { get; set; }
        public string? ACIKLAMA3 { get; set; }
        public string? ACIKLAMA4 { get; set; }
        public double MIKTAR { get; set; }          
        public string GC { get; set; } = null!;
        public int DEPO_KODU { get; set; }
        public DateTime? SON_KULLANMA_TARIHI { get; set; }
        public string? HUCRE_KODU { get; set; }
        public string? KAYITYAPANKUL { get; set; }
        public DateTime KAYITTARIHI { get; set; }
        public string? DUZELTMEYAPANKUL { get; set; }
        public DateTime? DUZELTMETARIHI { get; set; }
    }
}
