using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis.Models
{
    public class Enumlar
    {
        public enum EBelgeTipi
        {
            AlisIrsaliyesi = 0,
            SatisIrsaliyesi = 2,
            DepoTransferi = 3,
            AmbarGiris = 4,
            AmbarCikis = 5,
            SatisIrsaliyesiIade = 6,
            AlisIrsaliyesiIade = 7,
            FasonGiris = 8,
            FasonCikis = 9,
            FasonGirisIade = 10, 
            FasonCikisIade = 11, 
            SatisFaturasi = 12, 
            SatisFaturasiIade = 13, 
            AlisFaturasi = 14, 
            AlisFaturasiIade = 15, 
            KonsinyeAlisIrsaliyesi = 16,
        }
    }
}
