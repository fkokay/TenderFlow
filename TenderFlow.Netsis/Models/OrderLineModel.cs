using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class OrderLineModel
    {
        public string SIPARIS_NO { get; set; }
        public int SIRA { get; set; }
        public string STOK_KODU { get; set; }
        public string STOK_ADI { get; set; }
        public decimal MIKTAR { get; set; }
        public decimal KALAN { get; set; }
        public decimal FIYAT { get; set; }
        public decimal TUTAR { get; set; }
    }
}
