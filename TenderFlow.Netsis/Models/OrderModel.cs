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
        public decimal TOPLAM_MIK { get; set; }
        public decimal GENELTOPLAM { get; set; }
        public int DOVIZTIP { get; set; }
        public string? KAPATILMIS { get; set; }

        public List<OrderLineModel> Lines { get; set; } = new();
    }
}
