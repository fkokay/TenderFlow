using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Netsis
{
    public class NetsisSession
    {
        public static string GetProcessId(SqlConnection con)
        {
            using var cmd = new SqlCommand("SELECT dbo.NETPROCESSID()", con);
            return cmd.ExecuteScalar()?.ToString() ?? "";
        }

        public static bool SessionExists(SqlConnection con, string pid)
        {
            using var cmd = new SqlCommand(
                "SELECT COUNT(*) FROM NETSIS..NETSESSION WHERE [V$PROCESSID]=@p", con);
            cmd.Parameters.AddWithValue("@p", pid);
            return (int)cmd.ExecuteScalar() > 0;
        }

        public static void CreateSession(SqlConnection con, string pid)
        {
            string sql = @"
            INSERT INTO NETSIS..NETSESSION
            (V$PROCESSID, V$ISLETME_KODU, V$SUBE_KODU,
             V$NETUSERID, V$NETUSERNAME, V$MERKEZMI,
             V$LOGTUTULACAK, V$ILERIGUVENLIKSISTEMI,
             V$NETUSERGRPID, V$WORKPLACEVARMI,
             V$CARIKULTIPI, V$MUHKULTIPI,
             V$ESNEKYAPVARMI, V$NETKEY)
             
            VALUES
            (@p, 1, 0, 0, 'admin',
             'E', 'H', 'H',
             -1, 'H', 0, 0, 'H', NULL)
        ";

            using var cmd = new SqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@p", pid);
            cmd.ExecuteNonQuery();
        }
    }
}
