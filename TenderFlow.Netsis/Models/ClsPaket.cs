using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class ClsPaket
    {
        public ClsPaket()
        {
            this.PaketID = -1;
            this.PaketTanimi = string.Empty;
            this.PaketKodu = string.Empty;
            this.BelgeTipi = string.Empty;
            this.BelgeNumarasi = string.Empty;
            this.En = 0.0;
            this.Boy = 0.0;
            this.Yukseklik = 0.0;
            this.Dara = 0.0;
            this.Brut = 0.0;
            this.Net = 0.0;
            this.DepoKodu = -1;
            this.KalemListe = new List<ClsKalem>();
        }

        public int PaketID { get; set; }

        public string PaketTanimi { get; set; }

        public string PaketKodu { get; set; }

        public string BelgeTipi { get; set; }

        public string BelgeNumarasi { get; set; }

        public double En { get; set; }

        public double Boy { get; set; }

        public double Yukseklik { get; set; }

        public double Dara { get; set; }

        public double Brut { get; set; }

        public double Net { get; set; }

        public int DepoKodu { get; set; }

        public List<ClsPaket.ClsKalem> KalemListe { get; set; }

        public void KalemleriTemizle() => this.KalemListe.Clear();

        public void KalemEkle(string StokKodu, string StokAdi, string YapKod, string YapAcik, int DepoKodu, double Miktar)
        {
            this.KalemListe.Add(new ClsKalem()
            {
                StokKodu = StokKodu,
                StokAdi = StokAdi,
                YapKod = YapKod,
                YapAcik = YapAcik,
                DepoKodu = DepoKodu,
                Miktar = Miktar
            });
        }

        public string OnayStringOlustur()
        {
            string str = "";
            return str;
        }

        public class ClsKalem
        {
            public ClsKalem()
            {
                this.StokKodu = string.Empty;
                this.StokAdi = string.Empty;
                this.YapKod = string.Empty;
                this.YapAcik = string.Empty;
                this.DepoKodu = -1;
                this.Miktar = 0.0;
            }

            public string StokKodu { get; set; }

            public string StokAdi { get; set; }

            public string YapKod { get; set; }

            public string YapAcik { get; set; }

            public int DepoKodu { get; set; }

            public double Miktar { get; set; }
        }
    }

}
