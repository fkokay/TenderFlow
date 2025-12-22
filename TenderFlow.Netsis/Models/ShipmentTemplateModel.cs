using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ShipmentTemplateModel
    {
        public string TEMPLATEID { get; set; } = string.Empty;
        public string? LICENSEPLATEID { get; set; }
        public string? CARRIERVKN { get; set; }
        public string? CARRIERNAME { get; set; }
        public string? CARRIERSUBCITY { get; set; }
        public string? CARRIERCITY { get; set; }
        public string? CARRIERCOUNTRY { get; set; }
        public string? CARRIERPOSTAL { get; set; }

        public string? DPERSON1FIRSTNAME { get; set; }
        public string? DPERSON1FAMILYNAME { get; set; }
        public string? DPERSON1TITLE { get; set; }
        public string? DPERSON1NID { get; set; }

        public string? DPERSON2FIRSTNAME { get; set; }
        public string? DPERSON2FAMILYNAME { get; set; }
        public string? DPERSON2TITLE { get; set; }
        public string? DPERSON2NID { get; set; }

        public string? DPERSON3FIRSTNAME { get; set; }
        public string? DPERSON3FAMILYNAME { get; set; }
        public string? DPERSON3TITLE { get; set; }
        public string? DPERSON3NID { get; set; }

        public string? DORSEPLAKA1 { get; set; }
        public string? DORSEPLAKA2 { get; set; }
        public string? DORSEPLAKA3 { get; set; }

        public string? ACIKLAMA { get; set; }

        public short SUBE_KODU { get; set; }

        public string? KAYITYAPANKUL { get; set; }
        public DateTime? KAYITTARIHI { get; set; }
        public string? DUZELTMEYAPANKUL { get; set; }
        public DateTime? DUZELTMETARIHI { get; set; }

        public char? C_YEDEK1 { get; set; }
        public char? C_YEDEK2 { get; set; }

        public DateTime? D_YEDEK1 { get; set; }
        public DateTime? D_YEDEK2 { get; set; }

        public double? F_YEDEK1 { get; set; }
        public double? F_YEDEK2 { get; set; }

        public int? I_YEDEK1 { get; set; }
        public int? I_YEDEK2 { get; set; }

        public string? S_YEDEK1 { get; set; }
        public string? S_YEDEK2 { get; set; }

        public short ISLETME_KODU { get; set; }
    }
}
