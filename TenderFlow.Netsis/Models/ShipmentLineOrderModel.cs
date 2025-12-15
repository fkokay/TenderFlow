using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ShipmentLineOrderModel
    {
        public string SUBE_KODU { get; set; }
        public string BELGE_NO { get; set; }
        public int INCKEYNO { get; set; }
        public string SEVKEMRI_NO { get; set; }
        public int SEVKEMRI_SIRA { get; set; }
        public string SEVKEMRI_VAR { get; set; }   // 'E' / 'H'
        public string TESLIM_CARI { get; set; }

        public string SIPARIS_NO { get; set; }
        public int SIPARIS_SIRA { get; set; }

        public int SIRA { get; set; }
        public string STOK_KODU { get; set; }
        public string YAPKOD { get; set; }

        public decimal MIKTAR { get; set; }
        public decimal STHAR_BF { get; set; }
        public decimal? STHAR_DOVFIAT { get; set; }
        public int? STHAR_DOVTIP { get; set; }
        public decimal? STHAR_SATISK { get; set; }
        public decimal? STHAR_SATISK2 { get; set; }
        public decimal? STRA_SATISK3 { get; set; }
        public decimal? STRA_SATISK4 { get; set; }
        public decimal? STRA_SATISK5 { get; set; }
        public decimal? STRA_SATISK6 { get; set; }

        public int DEPO_KODU { get; set; }
        public string HUCRE_KODU { get; set; }

        public string IRSALIYE { get; set; }   // 'E' / 'H'

        public string PAKET_KILIT { get; set; }  // 'E' / 'H'

        public string KAYITYAPANKUL { get; set; }
        public DateTime KAYITTARIHI { get; set; }
    }
}
