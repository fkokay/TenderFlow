using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class SevktraModel
    {
        public string SIPARIS_NO { get; set; }
        public int SIRA { get; set; }
        public string STOK_KODU { get; set; }
        public string STOK_ADI { get; set;   }
        public double MIKTAR { get; set; }
        public string OLCUBR { get; set; }
    }
}
