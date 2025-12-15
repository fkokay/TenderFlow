using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis
{
    public class NetsisConfig
    {
        public string Server { get; set; } = "192.168.1.100";
        public string Database { get; set; } = "MAKROLAB25";
        public string User { get; set; } = "sa";
        public string Password { get; set; } = "sapass";

        public string ApplicationName { get; set; } = "TENDERFLOW";

        public bool Encrypt { get; set; } = true;
        public bool TrustServerCertificate { get; set; } = true;
    }
}
