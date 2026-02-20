using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class OrderModel
    {
        public string SIPARIS_NO { get; set; } = string.Empty;
        public string CARI_KODU { get; set; } = string.Empty;
        public DateTime TARIH { get; set; }
        public string? ACIKLAMA { get; set; }
        public string? ACIKLAMA1 { get; set; }
        public string? ACIKLAMA2 { get; set; }
        public string? ACIKLAMA3 { get; set; }
        public string? ACIKLAMA4 { get; set; }
        public string? ACIKLAMA5 { get; set; }
        public string? ACIKLAMA6 { get; set; }
        public string? ACIKLAMA7 { get; set; }
        public string? ACIKLAMA8 { get; set; }
        public string? ACIKLAMA9 { get; set; }
        public string? ACIKLAMA10 { get; set; }
        public string? ACIKLAMA11 { get; set; }
        public string? ACIKLAMA12 { get; set; }
        public string? ACIKLAMA13 { get; set; }
        public string? ACIKLAMA14 { get; set; }
        public string? ACIKLAMA15 { get; set; }
        public string? ACIKLAMA16 { get; set; } 
        public decimal TOPLAM_MIK { get; set; }
        public decimal GENELTOPLAM { get; set; }
        public int DOVIZTIP { get; set; }
        public string? KAPATILMIS { get; set; }
        public string? KOD1 { get; set; }
        public string? KOD2 { get; set; }
        public decimal TEVKIFATCARPAN { get; set; }
        public int? TEVKIFATEFATKODU { get; set; }

        public List<OrderLineModel> Lines { get; set; } = new();
    }
}
