using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis
{
    public class NetsisConnection
    {
        public SqlConnection Connection { get; private set; }
        private readonly NetsisConfig _config;

        public NetsisConnection(NetsisConfig config)
        {
            _config = config;
        }

        public SqlConnection Open()
        {
            var cs = new SqlConnectionStringBuilder
            {
                DataSource = _config.Server,
                InitialCatalog = _config.Database,
                UserID = _config.User,
                Password = _config.Password,
                ApplicationName = _config.ApplicationName,
                Encrypt = _config.Encrypt,
                TrustServerCertificate = _config.TrustServerCertificate
            };

            Connection = new SqlConnection(cs.ToString());
            Connection.Open();

            string pid = NetsisSession.GetProcessId(Connection);

            if (!NetsisSession.SessionExists(Connection, pid))
                NetsisSession.CreateSession(Connection, pid);

            return Connection;
        }
    }
}
