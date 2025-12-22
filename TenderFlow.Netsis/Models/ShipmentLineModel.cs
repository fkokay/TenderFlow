namespace TenderFlow.Netsis.Models
{
    public class ShipmentLineModel
    {
        public int ID { get; set; }
        public short SUBE_KODU { get; set; }
        public int TIP { get; set; }
        public string BELGENO { get; set; } = string.Empty;
        public int INCKEYNO { get; set; }
        public string SIPNO { get; set; } = string.Empty;
        public int SIPKONT { get; set; }
        public string? TESCARI { get; set; }
        public string? TESCARIADI { get; set; }
        public byte? NAKLIYESEKLI { get; set; }
        public byte? TESLIMATYERI { get; set; }
        public byte? IRSFLAG { get; set; }
        public decimal? YUKMIK { get; set; }
        public short? SIRA { get; set; }
        public decimal? MIKTAR { get; set; }
        public decimal? MALFISK { get; set; }
        public string? ACIK1 { get; set; }
        public string? ACIK2 { get; set; }
        public decimal? MIKTAR2 { get; set; }
        public string? STOKKODU { get; set; }
        public string? STOKADI { get; set; }
        public short? DEPO { get; set; }
        public string? KAYITYAPANKUL { get; set; }
        public DateTime? KAYITTARIHI { get; set; }
        public string? DUZELTMEYAPANKUL { get; set; }
        public DateTime? DUZELTMETARIHI { get; set; }
        public string? C_YEDEK1 { get; set; }
        public string? C_YEDEK2 { get; set; }
        public int? I_YEDEK1 { get; set; }
        public short? I_YEDEK2 { get; set; }
        public decimal? F_YEDEK1 { get; set; }
        public decimal? F_YEDEK2 { get; set; }
        public decimal? F_YEDEK3 { get; set; }
        public DateTime? T_YEDEK1 { get; set; }
        public string? YAPKOD { get; set; }
    }
}
