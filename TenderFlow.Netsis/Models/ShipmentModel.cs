namespace TenderFlow.Netsis.Models
{
    public class ShipmentModel
    {
        public short SUBE_KODU { get; set; }
        public byte TIP { get; set; }
        public string BELGENO { get; set; } = string.Empty;
        public DateTime? TARIH { get; set; }
        public DateTime? SEVKTARIHI { get; set; }
        public string? KOD1 { get; set; }
        public string? KOD2 { get; set; }
        public string? ACIK1 { get; set; }

        public string? ACIK2 { get; set; }

        public string? ACIK3 { get; set; }
        public string? KAMYONNO { get; set; }
        public string? UPDATEKODU { get; set; }
        public string? KAYITYAPANKUL { get; set; }
        public DateTime? KAYITTARIHI { get; set; }
        public string? DUZELTMEYAPANKUL { get; set; }
        public DateTime? DUZELTMETARIHI { get; set; }
        public string? C_YEDEK1 { get; set; }
        public string? C_YEDEK2 { get; set; }
        public string? C_YEDEK3 { get; set; }
        public short? I_YEDEK1 { get; set; }
        public short? I_YEDEK2 { get; set; }
        public short? I_YEDEK3 { get; set; }
        public decimal? F_YEDEK1 { get; set; }
        public decimal? F_YEDEK2 { get; set; }
        public decimal? F_YEDEK3 { get; set; }
        public decimal? F_YEDEK4 { get; set; }
        public DateTime? T_YEDEK1 { get; set; }
        public DateTime? T_YEDEK2 { get; set; }
        public string? ACIK4 { get; set; }
        public string? ACIK5 { get; set; }
        public string? ACIK6 { get; set; }
        public string? ACIK7 { get; set; }
        public string? ACIK8 { get; set; }
        public string? ACIK9 { get; set; }
        public string? ACIK10 { get; set; }
        public string? SOFORISIM { get; set; }
        public bool KAPALI { get; set; }
        public bool KISMI_TESLIMAT { get; set; }
        public List<ShipmentLineModel> ShipmentLines { get; set; } = new List<ShipmentLineModel>();

    }
}
