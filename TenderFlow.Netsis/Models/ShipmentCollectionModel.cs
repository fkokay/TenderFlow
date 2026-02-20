using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ShipmentCollectionModel
    {
        public int ID { get; set; }
        public int SIRA { get; set; }
        public string STOK_KODU { get; set; }
        public string STOK_ADI { get; set; }
        public string YAPKOD { get; set; }
        public string YAPACIK { get; set; }
        public string SIPARIS_NO { get; set; }
        public int SEVKEMRI_SIRA { get; set; }
        public double MIKTAR { get; set; }
        public int DEPO_KODU { get; set; }
        public string HUCRE_KODU { get; set; }
        public string IRSALIYE { get; set;  }
        public string KAYITYAPANKUL { get; set;  }
        public DateTime KAYITTARIHI { get; set; }
        public string BARKOD1 { get; set; }
        public string BARKOD2 { get; set; }
    }
}
