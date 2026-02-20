using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Text;
using System.Transactions;
using TenderFlow.Core.Utils;
using TenderFlow.Netsis.Models;

namespace TenderFlow.Netsis
{
    public class ShipmentManager
    {
        private readonly SqlConnection _con;

        public ShipmentManager(SqlConnection con)
        {
            _con = con;
        }

        public async Task<IEnumerable<ShipmentOrderModel>> GetShipmentOrdersAsync(string orderNo,string cariKodu, DateTime? startDate = null, DateTime? endDate = null, string? depo = null, bool? hasBalance = null)
        {
            string sql = @"
			WITH SONUC AS (
			    SELECT SIP.ID,
			           SIP.BELGE_NO,
			           SIP.BELGE_TIPI,
			           SIP.SIRA,
			           SIP.CARI_KODU,
			           SIP.TESLIM_CARI_KODU,
			           SIP.TARIH,
			           SIP.TESLIM_TARIHI,
			           SIP.STOK_KODU,
			           SIP.YAPKOD,
			           SIP.MIKTAR,
			           SIP.KALAN,
			           SIP.TAMAMLANAN,
			           SIP.DEPO_KODU,
			           SIP.PROJE_KODU,
			           SIP.EKALAN_NEDEN,
			           SIP.EKALAN1,
			           SIP.EKALAN2,
			           SIP.KOSUL_KODU,
			           SIP.PLASIYER_KODU,
			           ISNULL(BAK.BAKIYE, 0) AS DEPO_BAKIYE
			    FROM TF_VW_SIPARISDETAY AS SIP
			    LEFT JOIN (
			        SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			        FROM TF_VW_PICSEVKEMRIDETAY
			        GROUP BY SIPARIS_NO, SIPARIS_SIRA
			    ) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			    LEFT JOIN TF_VW_STOKBAKIYE AS BAK 
			      ON BAK.STOK_KODU = SIP.STOK_KODU AND ISNULL(BAK.YAPKOD, '') = ISNULL(SIP.YAPKOD, '') 
			      AND BAK.DEPO_KODU = SIP.DEPO_KODU
			    WHERE SIP.BELGE_TIPI = 'MS' 
			      AND SIP.KAPALI = 'H' 
			      AND SIP.KALAN - ISNULL(SEVK.MIKTAR, 0) > 0
			      AND (@BASTAR IS NULL OR ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH) >= @BASTAR)
			      AND (@BITTAR IS NULL OR ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH) <= @BITTAR)
				  AND SIP.BELGE_NO LIKE 'KGS%'
				  AND (@BELGE_NO IS NULL OR (SIP.BELGE_NO LIKE '%' + @BELGE_NO+ '%'))
			      AND (@CARI_KODU IS NULL OR SIP.CARI_KODU LIKE '%' + @CARI_KODU)
			      AND (@DEPO_KODU IS NULL OR SIP.DEPO_KODU = @DEPO_KODU)
			      AND (@HAS_BALANCE = 0 OR ISNULL(BAK.BAKIYE, 0) > 0)
			)
			
			SELECT SIP.ID, SIP.BELGE_NO AS SIPARIS_NO, SIP.SIRA, SIP.CARI_KODU, CARI.CARI_ADI,
			       SIP.TESLIM_CARI_KODU, CARI_TESLIM.CARI_ADI AS TESLIM_CARI_ADI,
			       SIP.TARIH, SIP.TESLIM_TARIHI, SIP.STOK_KODU, 
			       (CASE WHEN SIP.EKALAN_NEDEN = '1' AND SIP.EKALAN1 IS NOT NULL THEN SIP.EKALAN1 ELSE STOK.STOK_ADI END) AS STOK_ADI, 
			       SIP.YAPKOD, YAP.YAPACIK, SIP.MIKTAR AS SIPARIS_MIKTAR,
			       SIP.TAMAMLANAN AS GONDERILEN_MIKTAR, SIP.KALAN - ISNULL(SEVK.MIKTAR, 0) AS MIKTAR,
			       SIP.DEPO_KODU, DEPO.DEPO_TANIMI, SIP.PROJE_KODU, SIP.EKALAN1, SIP.EKALAN2, SIP.DEPO_BAKIYE,MAS.TIPI
			FROM SONUC AS SIP
			INNER JOIN TF_VW_SIPARIS AS MAS ON MAS.BELGE_NO = SIP.BELGE_NO AND MAS.BELGE_TIPI = SIP.BELGE_TIPI AND MAS.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN TF_VW_CARI AS CARI ON CARI.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN TF_VW_CARI AS CARI_TESLIM ON CARI_TESLIM.CARI_KODU = SIP.TESLIM_CARI_KODU
			LEFT JOIN TF_VW_STOK AS STOK ON STOK.STOK_KODU = SIP.STOK_KODU
			LEFT JOIN TF_VW_DEPO AS DEPO ON DEPO.DEPO_KODU = SIP.DEPO_KODU
			LEFT JOIN TF_VW_YAPMAS AS YAP ON YAP.YAPKOD = SIP.YAPKOD
			LEFT JOIN (
			    SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			    FROM TF_VW_PICSEVKEMRIDETAY
			    GROUP BY SIPARIS_NO, SIPARIS_SIRA
			) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			LEFT JOIN TF_VW_PLASIYER AS PL ON PL.PLASIYER_KODU = SIP.PLASIYER_KODU
			ORDER BY ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH), SIP.BELGE_NO, SIP.SIRA";

            var param = new
            {
				BELGE_NO = string.IsNullOrWhiteSpace(orderNo) ? null : orderNo,
                CARI_KODU = string.IsNullOrWhiteSpace(cariKodu) ? null : cariKodu,
                BASTAR = startDate,
                BITTAR = endDate,
                DEPO_KODU = string.IsNullOrWhiteSpace(depo) ? null : depo,
                HAS_BALANCE = hasBalance == true ? 1 : 0
            };

            var list = (await _con.QueryAsync<ShipmentOrderModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;
        }
        public async Task<IEnumerable<ShipmentOrderModel>> GetShipmentOrdersByIdsAsync(List<int> ids)
        {
            string sql = @"
			WITH SONUC AS (
			    SELECT SIP.ID,
			           SIP.BELGE_NO,
			           SIP.BELGE_TIPI,
			           SIP.SIRA,
			           SIP.CARI_KODU,
			           SIP.TESLIM_CARI_KODU,
			           SIP.TARIH,
			           SIP.TESLIM_TARIHI,
			           SIP.STOK_KODU,
			           SIP.YAPKOD,
			           SIP.MIKTAR,
			           SIP.KALAN,
			           SIP.TAMAMLANAN,
			           SIP.DEPO_KODU,
			           SIP.PROJE_KODU,
			           SIP.EKALAN_NEDEN,
			           SIP.EKALAN1,
			           SIP.EKALAN2,
			           SIP.KOSUL_KODU,
			           SIP.PLASIYER_KODU,
			           ISNULL(BAK.BAKIYE, 0) AS DEPO_BAKIYE
			    FROM TF_VW_SIPARISDETAY AS SIP
			    LEFT JOIN (
			        SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			        FROM TF_VW_PICSEVKEMRIDETAY
			        GROUP BY SIPARIS_NO, SIPARIS_SIRA
			    ) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			    LEFT JOIN TF_VW_STOKBAKIYE AS BAK 
			      ON BAK.STOK_KODU = SIP.STOK_KODU AND ISNULL(BAK.YAPKOD, '') = ISNULL(SIP.YAPKOD, '') 
			      AND BAK.DEPO_KODU = SIP.DEPO_KODU
			    WHERE SIP.ID IN @Ids
			)
			
			SELECT SIP.ID, SIP.BELGE_NO AS SIPARIS_NO, SIP.SIRA, SIP.CARI_KODU, CARI.CARI_ADI,
			       SIP.TESLIM_CARI_KODU, CARI_TESLIM.CARI_ADI AS TESLIM_CARI_ADI,
			       SIP.TARIH, SIP.TESLIM_TARIHI, SIP.STOK_KODU, 
			       (CASE WHEN SIP.EKALAN_NEDEN = '1' AND SIP.EKALAN1 IS NOT NULL THEN SIP.EKALAN1 ELSE STOK.STOK_ADI END) AS STOK_ADI, 
			       SIP.YAPKOD, YAP.YAPACIK, SIP.MIKTAR AS SIPARIS_MIKTAR,
			       SIP.TAMAMLANAN AS GONDERILEN_MIKTAR, SIP.KALAN - ISNULL(SEVK.MIKTAR, 0) AS MIKTAR,
			       SIP.DEPO_KODU, DEPO.DEPO_TANIMI, SIP.PROJE_KODU, SIP.EKALAN1, SIP.EKALAN2, SIP.DEPO_BAKIYE
			FROM SONUC AS SIP
			INNER JOIN TF_VW_SIPARIS AS MAS ON MAS.BELGE_NO = SIP.BELGE_NO AND MAS.BELGE_TIPI = SIP.BELGE_TIPI AND MAS.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN TF_VW_CARI AS CARI ON CARI.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN TF_VW_CARI AS CARI_TESLIM ON CARI_TESLIM.CARI_KODU = SIP.TESLIM_CARI_KODU
			LEFT JOIN TF_VW_STOK AS STOK ON STOK.STOK_KODU = SIP.STOK_KODU
			LEFT JOIN TF_VW_DEPO AS DEPO ON DEPO.DEPO_KODU = SIP.DEPO_KODU
			LEFT JOIN TF_VW_YAPMAS AS YAP ON YAP.YAPKOD = SIP.YAPKOD
			LEFT JOIN (
			    SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			    FROM TF_VW_PICSEVKEMRIDETAY
			    GROUP BY SIPARIS_NO, SIPARIS_SIRA
			) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			LEFT JOIN TF_VW_PLASIYER AS PL ON PL.PLASIYER_KODU = SIP.PLASIYER_KODU
			ORDER BY ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH), SIP.BELGE_NO, SIP.SIRA";
            var param = new
            {
                Ids = ids
            };

            var list = (await _con.QueryAsync<ShipmentOrderModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;
        }
        public async Task<ShipmentOrderModel> GetShipmentOrderAsync(int id)
        {
            string sql = @"
			WITH SONUC AS (
			    SELECT SIP.ID,
			           SIP.BELGE_NO,
			           SIP.BELGE_TIPI,
			           SIP.SIRA,
			           SIP.CARI_KODU,
			           SIP.TESLIM_CARI_KODU,
			           SIP.TARIH,
			           SIP.TESLIM_TARIHI,
			           SIP.STOK_KODU,
			           SIP.YAPKOD,
			           SIP.MIKTAR,
			           SIP.KALAN,
			           SIP.TAMAMLANAN,
			           SIP.DEPO_KODU,
			           SIP.PROJE_KODU,
			           SIP.EKALAN_NEDEN,
			           SIP.EKALAN1,
			           SIP.EKALAN2,
			           SIP.KOSUL_KODU,
			           SIP.PLASIYER_KODU,
			           ISNULL(BAK.BAKIYE, 0) AS DEPO_BAKIYE
			    FROM TF_VW_SIPARISDETAY AS SIP
			    LEFT JOIN (
			        SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			        FROM TF_VW_PICSEVKEMRIDETAY
			        GROUP BY SIPARIS_NO, SIPARIS_SIRA
			    ) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			    LEFT JOIN TF_VW_STOKBAKIYE AS BAK 
			      ON BAK.STOK_KODU = SIP.STOK_KODU AND ISNULL(BAK.YAPKOD, '') = ISNULL(SIP.YAPKOD, '') 
			      AND BAK.DEPO_KODU = SIP.DEPO_KODU
			    WHERE SIP.ID = @Id
			)
			
			SELECT SIP.ID, SIP.BELGE_NO AS SIPARIS_NO, SIP.SIRA, SIP.CARI_KODU, CARI.CARI_ADI,
			       SIP.TESLIM_CARI_KODU, CARI_TESLIM.CARI_ADI AS TESLIM_CARI_ADI,
			       SIP.TARIH, SIP.TESLIM_TARIHI, SIP.STOK_KODU, 
			       (CASE WHEN SIP.EKALAN_NEDEN = '1' AND SIP.EKALAN1 IS NOT NULL THEN SIP.EKALAN1 ELSE STOK.STOK_ADI END) AS STOK_ADI, 
			       SIP.YAPKOD, YAP.YAPACIK, SIP.MIKTAR AS SIPARIS_MIKTAR,
			       SIP.TAMAMLANAN AS GONDERILEN_MIKTAR, SIP.KALAN - ISNULL(SEVK.MIKTAR, 0) AS MIKTAR,
			       SIP.DEPO_KODU, DEPO.DEPO_TANIMI, SIP.PROJE_KODU, SIP.EKALAN1, SIP.EKALAN2, SIP.DEPO_BAKIYE
			FROM SONUC AS SIP
			INNER JOIN TF_VW_SIPARIS AS MAS ON MAS.BELGE_NO = SIP.BELGE_NO AND MAS.BELGE_TIPI = SIP.BELGE_TIPI AND MAS.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN TF_VW_CARI AS CARI ON CARI.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN TF_VW_CARI AS CARI_TESLIM ON CARI_TESLIM.CARI_KODU = SIP.TESLIM_CARI_KODU
			LEFT JOIN TF_VW_STOK AS STOK ON STOK.STOK_KODU = SIP.STOK_KODU
			LEFT JOIN TF_VW_DEPO AS DEPO ON DEPO.DEPO_KODU = SIP.DEPO_KODU
			LEFT JOIN TF_VW_YAPMAS AS YAP ON YAP.YAPKOD = SIP.YAPKOD
			LEFT JOIN (
			    SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			    FROM TF_VW_PICSEVKEMRIDETAY
			    GROUP BY SIPARIS_NO, SIPARIS_SIRA
			) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			LEFT JOIN TF_VW_PLASIYER AS PL ON PL.PLASIYER_KODU = SIP.PLASIYER_KODU
			ORDER BY ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH), SIP.BELGE_NO, SIP.SIRA";

            var param = new
            {
                Id = id
            };

            var list = (await _con.QueryAsync<ShipmentOrderModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list.First();
        }
        public async Task<string> CreateShipmentAsync(ShipmentModel shipment)
        {
            using var transaction = _con.BeginTransaction();
            try
            {
                string insertShipmentSql = @"
					INSERT INTO TBLSEVKMAS
					(
						SUBE_KODU, TIP, BELGENO, TARIH, SEVKTARIHI,
						KOD1, KOD2, ACIK1, ACIK2, ACIK3,
						KAMYONNO, UPDATEKODU, KAYITYAPANKUL, KAYITTARIHI,
						DUZELTMEYAPANKUL, DUZELTMETARIHI,
						C_YEDEK1, C_YEDEK2, C_YEDEK3,
						I_YEDEK1, I_YEDEK2, I_YEDEK3,
						F_YEDEK1, F_YEDEK2, F_YEDEK3, F_YEDEK4,
						T_YEDEK1, T_YEDEK2,
						ACIK4, ACIK5, ACIK6, ACIK7, ACIK8, ACIK9, ACIK10,
						SOFORISIM
					)
					VALUES
					(
						@SUBE_KODU, @TIP, @BELGENO, @TARIH, @SEVKTARIHI,
						@KOD1, @KOD2, @ACIK1, @ACIK2, @ACIK3,
						@KAMYONNO, @UPDATEKODU, @KAYITYAPANKUL, @KAYITTARIHI,
						@DUZELTMEYAPANKUL, @DUZELTMETARIHI,
						@C_YEDEK1, @C_YEDEK2, @C_YEDEK3,
						@I_YEDEK1, @I_YEDEK2, @I_YEDEK3,
						@F_YEDEK1, @F_YEDEK2, @F_YEDEK3, @F_YEDEK4,
						@T_YEDEK1, @T_YEDEK2,
						@ACIK4, @ACIK5, @ACIK6, @ACIK7, @ACIK8, @ACIK9, @ACIK10,
						@SOFORISIM
					)";
                var result = await _con.ExecuteAsync(insertShipmentSql, shipment, transaction);

                foreach (var shipmentLine in shipment.ShipmentLines)
                {
                    string insertShipmentLineSql = @"
					INSERT INTO TBLSEVKTRA
					(
						SUBE_KODU, TIP, BELGENO, SIPNO, SIPKONT,
						TESCARI, NAKLIYESEKLI, TESLIMATYERI, IRSFLAG,
						YUKMIK, SIRA, MIKTAR, MALFISK, ACIK1, ACIK2,
						MIKTAR2, STOKKODU, DEPO,
						KAYITYAPANKUL, KAYITTARIHI,
						DUZELTMEYAPANKUL, DUZELTMETARIHI,
						C_YEDEK1, C_YEDEK2,
						I_YEDEK1, I_YEDEK2,
						F_YEDEK1, F_YEDEK2, F_YEDEK3,
						T_YEDEK1, YAPKOD
					)
					VALUES
					(
						@SUBE_KODU, @TIP, @BELGENO, @SIPNO, @SIPKONT,
						@TESCARI, @NAKLIYESEKLI, @TESLIMATYERI, @IRSFLAG,
						@YUKMIK, @SIRA, @MIKTAR, @MALFISK, @ACIK1, @ACIK2,
						@MIKTAR2, @STOKKODU, @DEPO,
						@KAYITYAPANKUL, @KAYITTARIHI,
						@DUZELTMEYAPANKUL, @DUZELTMETARIHI,
						@C_YEDEK1, @C_YEDEK2,
						@I_YEDEK1, @I_YEDEK2,
						@F_YEDEK1, @F_YEDEK2, @F_YEDEK3,
						@T_YEDEK1, @YAPKOD
					)";

                    await _con.ExecuteAsync(insertShipmentLineSql, shipmentLine, transaction);
                }


                transaction.Commit();

                return shipment.BELGENO;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        public async Task<string> CreateShipmentDocumentNoAsync(ShipmentModel shipment)
        {
            string createShipmentDocumentNoSql = @"
					SELECT TOP 1 BELGENO
					FROM TBLSEVKMAS
					WHERE SUBE_KODU = @SUBE_KODU AND TIP = @TIP
					ORDER BY BELGENO DESC";

            string? belgeNo = await _con.ExecuteScalarAsync<string>(createShipmentDocumentNoSql, new
            {
                shipment.SUBE_KODU,
                shipment.TIP
            });

            return string.IsNullOrEmpty(belgeNo) ? "000000000000001" : MainUtils.NextKeyCode(belgeNo);
        }
        public async Task<IEnumerable<OrderManagementListModel>> GetShipmentManagementsAsync(string? orderNo, DateTime? startDate = null, DateTime? endDate = null, int status = 0, bool showCompleted = false)
        {

            string sql = @"
			IF OBJECT_ID('tempdb..#TSIFIRFIYAT') IS NOT NULL DROP TABLE #TSIFIRFIYAT
			SELECT V.BELGE_NO INTO #TSIFIRFIYAT
			FROM VNF_PICSEVKEMRIDETAY AS V
			INNER JOIN VNF_PICSIPARISDETAY AS S ON V.SIPARIS_NO = S.SIPARIS_NO AND V.TESLIM_CARI = S.CARI_KODU AND V.SIPARIS_SIRA = S.SIRA AND S.SIPARIS_TIPI = 'MS'
			WHERE S.NET_FIYAT <= 0
			GROUP BY V.BELGE_NO

			IF OBJECT_ID('tempdb..#TDURUMSAYI') IS NOT NULL DROP TABLE #TDURUMSAYI
			SELECT SEVKMAS.BELGENO AS BELGE_NO, DETAY.DURUM, DETAY.SAYI
			INTO #TDURUMSAYI FROM SEVKMAS
			INNER JOIN (SELECT BELGENO, MIN(I_YEDEK2) AS DURUM, COUNT(DISTINCT I_YEDEK2) AS SAYI
						FROM SEVKTRA
						WHERE TIP = 1
						GROUP BY BELGENO) AS DETAY ON DETAY.BELGENO = SEVKMAS.BELGENO
			WHERE SEVKMAS.TIP = 1
			ORDER BY DETAY.SAYI DESC

			IF OBJECT_ID('tempdb..#TBELGE') IS NOT NULL DROP TABLE #TBELGE
			SELECT * INTO #TBELGE
			FROM VNF_PICSEVKEMRI";
            if (startDate == null || endDate == null)
            {
                sql += " WHERE 1=1 ";
            }
            else
            {
                sql += " WHERE ISNULL(SEVKTARIHI, TARIH) BETWEEN @StartDate AND @EndDate ";
            }

            if (status > 0)
            {
                sql += " AND BELGE_NO IN (SELECT BELGE_NO FROM #TDURUMSAYI WHERE DURUM = " + status + ")";

            }
            else
            {
                if (showCompleted == false)
                {
                    sql += " AND (BELGE_NO IN (SELECT BELGE_NO FROM #TDURUMSAYI WHERE DURUM < 5 OR DURUM = 6) OR TOPLAM_KALAN > 0 OR TOPLAM_IRS_EDILMEYEN > 0)";
                }
            }

            sql += @" IF OBJECT_ID('tempdb..#TKULLANICI') IS NOT NULL DROP TABLE #TKULLANICI
			SELECT BELGENO AS BELGE_NO, CAST(I_YEDEK1 AS INT) AS KULLANICI
			INTO #TKULLANICI FROM TBLSEVKTRA
			WHERE BELGENO IN (SELECT BELGE_NO FROM #TBELGE) AND TIP = 1 AND I_YEDEK1 IS NOT NULL
			GROUP BY BELGENO, I_YEDEK1

			IF OBJECT_ID('tempdb..#TDURUM') IS NOT NULL DROP TABLE #TDURUM
			SELECT BELGENO AS BELGE_NO, CAST(I_YEDEK2 AS INT) AS DURUM
			INTO #TDURUM FROM TBLSEVKTRA
			WHERE BELGENO IN (SELECT BELGE_NO FROM #TBELGE) AND TIP = 1 AND I_YEDEK2 IS NOT NULL
			GROUP BY BELGENO, I_YEDEK2

			IF OBJECT_ID('tempdb..#TCARI') IS NOT NULL DROP TABLE #TCARI
			SELECT C.CARI_KODU, C.CARI_ADI,
						C.CARI_IL, C.CARI_ILCE,
						C.GRUP_TANIMI, C.KOD1_TANIMI, C.KOD2_TANIMI, C.KOD3_TANIMI, C.KOD4_TANIMI, C.KOD5_TANIMI,
						C.KULL1N, C.KULL2N, C.KULL3N, C.KULL4N, C.KULL5N, C.KULL6N, C.KULL7N, C.KULL8N, 
						C.KULL1S, C.KULL2S, C.KULL3S, C.KULL4S, C.KULL5S, C.KULL6S, C.KULL7S, C.KULL8S, 
						EFATURA_CARISI
			INTO #TCARI FROM VNF_CARI AS C
			LEFT OUTER JOIN TBLCARISAHATABLOESLEME AS SAHA_ES ON SAHA_ES.CARI_KOD = C.CARI_KODU
			WHERE C.CARI_KODU IN (SELECT CARI_KODU FROM #TBELGE)

			IF OBJECT_ID('tempdb..#TSIPARIS') IS NOT NULL DROP TABLE #TSIPARIS
			SELECT BELGENO AS BELGE_NO, SIPNO AS SIPARIS_NO INTO #TSIPARIS
			FROM TBLSEVKTRA
			WHERE TIP = 1 AND BELGENO IN (SELECT BELGE_NO FROM #TBELGE)
			GROUP BY BELGENO, SIPNO
			ORDER BY BELGE_NO, SIPARIS_NO

			IF OBJECT_ID('tempdb..#TOLUSANBELGE') IS NOT NULL DROP TABLE #TOLUSANBELGE
			SELECT T.SEVKEMRI_NO, B.BELGE_NO INTO #TOLUSANBELGE
			FROM VNF_PICSEVKEMRITOPLAMA AS T
			INNER JOIN VNF_PICBELGEDETAY AS B ON B.AMBAR_NO = T.INCKEYNO AND B.BELGE_TIPI IN ('SF', 'SI', 'DG')
			WHERE T.SEVKEMRI_NO IN (SELECT BELGE_NO FROM #TBELGE)
			GROUP BY T.SEVKEMRI_NO, B.BELGE_NO


			IF OBJECT_ID('tempdb..#TKULUME') IS NOT NULL DROP TABLE #TKULUME
			SELECT BELGE_NO,
					STUFF((SELECT ', ' + DF.ACIKLAMA
						   FROM #TDURUM AS D
						   INNER JOIN dbo.FNF_PICSEVKEMRIDURUM() AS DF ON DF.DURUM = D.DURUM
						   WHERE D.BELGE_NO = T.BELGE_NO
						   ORDER BY DF.SIRA
						   FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS DURUM_ACIKLAMA,
					STUFF((SELECT ', ' + (K.ADI + ISNULL(' ' + K.SOYADI, ''))
						   FROM #TKULLANICI AS B
						   INNER JOIN NetFect.dbo.TBLKULLANICI AS K ON K.ID = B.KULLANICI
						   WHERE B.BELGE_NO = T.BELGE_NO
						   FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS KULLANICI_ADSOYAD,
					STUFF((SELECT ', ' + SIPARIS_NO
						   FROM #TSIPARIS
						   WHERE BELGE_NO = T.BELGE_NO
						   FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS SIPARIS_NO
			INTO #TKULUME FROM #TBELGE AS T
			CREATE NONCLUSTERED INDEX IND_KUMULE_1 ON #TKULUME (BELGE_NO) INCLUDE ([DURUM_ACIKLAMA],[KULLANICI_ADSOYAD],[SIPARIS_NO])

			SELECT T.BELGE_NO, T.TARIH, T.SEVKTARIHI,
					KUM.DURUM_ACIKLAMA, KUM.KULLANICI_ADSOYAD,
					T.TOPLAM_MIKTAR, T.TOPLAM_TOPLANAN, T.TOPLAM_KALAN, T.TOPLAM_IRS_EDILEN, T.TOPLAM_IRS_EDILMEYEN,
					T.ACIK1, T.ACIK2, T.ACIK3, T.ACIK4, T.ACIK5, T.ACIK6, T.ACIK7, T.ACIK8, T.ACIK9, T.ACIK10,
					T.CARI_KODU, T.CARI_ADI, T.KAPALI, T.KISMI_TESLIMAT,
					STUFF((SELECT ', ' + BELGE_NO
				   FROM #TOLUSANBELGE
				   WHERE SEVKEMRI_NO = T.BELGE_NO
				   FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS OLUSAN_BELGELER,
					C.GRUP_TANIMI, C.KOD1_TANIMI, C.KOD2_TANIMI, C.KOD3_TANIMI, C.KOD4_TANIMI, C.KOD5_TANIMI,
					(CASE WHEN TSIFIR.BELGE_NO IS NULL THEN 'H' ELSE 'E' END) AS SIFIR_FIYAT_VAR,KUM.SIPARIS_NO,
					C.KULL1N AS CARI_KULL1N,C.KULL2N AS CARI_KULL2N,C.KULL3N AS CARI_KULL3N,C.KULL4N AS CARI_KULL4N,C.KULL5N AS CARI_KULL5N,C.KULL6N AS CARI_KULL6N,C.KULL7N AS CARI_KULL7N,C.KULL8N AS CARI_KULL8N,
					C.KULL1S AS CARI_KULL1S,C.KULL2S AS CARI_KULL2S,C.KULL3S AS CARI_KULL3S,C.KULL4S AS CARI_KULL4S,C.KULL5S AS CARI_KULL5S,C.KULL6S AS CARI_KULL6S,C.KULL7S AS CARI_KULL7S,C.KULL8S AS CARI_KULL8S,
					C.EFATURA_CARISI
			FROM #TBELGE AS T
			LEFT OUTER JOIN #TSIFIRFIYAT AS TSIFIR ON TSIFIR.BELGE_NO = T.BELGE_NO
			LEFT OUTER JOIN #TKULUME AS KUM ON KUM.BELGE_NO = T.BELGE_NO
			LEFT OUTER JOIN #TCARI AS C ON T.CARI_KODU = C.CARI_KODU";

            if (!string.IsNullOrEmpty(orderNo))
            {
                sql += " WHERE KUM.SIPARIS_NO LIKE '%' + @OrderNo + '%' ";
            }

            var param = new
            {
                StartDate = startDate,
                EndDate = endDate,
				OrderNo = orderNo,
            };

            var list = (await _con.QueryAsync<OrderManagementListModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;
        }
        public async Task<IEnumerable<OrderManagementListModel>> GetShipmentManagementsByDocumentNumbersAsync(List<string> documentNumbers)
        {
            string sql = @"
			IF OBJECT_ID('tempdb..#TDURUMSAYI') IS NOT NULL DROP TABLE #TDURUMSAYI;
			SELECT SEVKMAS.BELGENO AS BELGE_NO, DETAY.DURUM, DETAY.SAYI
			INTO #TDURUMSAYI 
			FROM SEVKMAS
			INNER JOIN (
			    SELECT BELGENO, MIN(I_YEDEK2) AS DURUM, COUNT(DISTINCT I_YEDEK2) AS SAYI
			    FROM SEVKTRA
			    WHERE TIP = 1
			    GROUP BY BELGENO
			) AS DETAY ON DETAY.BELGENO = SEVKMAS.BELGENO
			WHERE SEVKMAS.TIP = 1
			  AND SEVKMAS.BELGENO IN @DocumentNumbers  
			ORDER BY DETAY.SAYI DESC;

			IF OBJECT_ID('tempdb..#TBELGE') IS NOT NULL DROP TABLE #TBELGE;
			SELECT * INTO #TBELGE
			FROM VNF_PICSEVKEMRI
			WHERE BELGE_NO IN @DocumentNumbers;

			IF OBJECT_ID('tempdb..#TKULLANICI') IS NOT NULL DROP TABLE #TKULLANICI;
			SELECT BELGENO AS BELGE_NO, CAST(I_YEDEK1 AS INT) AS KULLANICI
			INTO #TKULLANICI 
			FROM TBLSEVKTRA
			WHERE BELGENO IN (SELECT BELGE_NO FROM #TBELGE) AND TIP = 1 AND I_YEDEK1 IS NOT NULL
			GROUP BY BELGENO, I_YEDEK1;

			IF OBJECT_ID('tempdb..#TDURUM') IS NOT NULL DROP TABLE #TDURUM;
			SELECT BELGENO AS BELGE_NO, CAST(I_YEDEK2 AS INT) AS DURUM
			INTO #TDURUM 
			FROM TBLSEVKTRA
			WHERE BELGENO IN (SELECT BELGE_NO FROM #TBELGE) AND TIP = 1 AND I_YEDEK2 IS NOT NULL
			GROUP BY BELGENO, I_YEDEK2;

			IF OBJECT_ID('tempdb..#TCARI') IS NOT NULL DROP TABLE #TCARI;
			SELECT C.CARI_KODU, C.CARI_ADI,
			       C.CARI_IL, C.CARI_ILCE,C.CARI_ADRES,
			       C.GRUP_TANIMI, C.KOD1_TANIMI, C.KOD2_TANIMI, C.KOD3_TANIMI, C.KOD4_TANIMI, C.KOD5_TANIMI,
			       C.KULL1N, C.KULL2N, C.KULL3N, C.KULL4N, C.KULL5N, C.KULL6N, C.KULL7N, C.KULL8N, 
			       C.KULL1S, C.KULL2S, C.KULL3S, C.KULL4S, C.KULL5S, C.KULL6S, C.KULL7S, C.KULL8S, 
			       EFATURA_CARISI
			INTO #TCARI 
			FROM VNF_CARI AS C
			LEFT OUTER JOIN TBLCARISAHATABLOESLEME AS SAHA_ES ON SAHA_ES.CARI_KOD = C.CARI_KODU
			WHERE C.CARI_KODU IN (SELECT CARI_KODU FROM #TBELGE);

			IF OBJECT_ID('tempdb..#TSIPARIS') IS NOT NULL DROP TABLE #TSIPARIS;
			SELECT BELGENO AS BELGE_NO, SIPNO AS SIPARIS_NO 
			INTO #TSIPARIS
			FROM TBLSEVKTRA
			WHERE TIP = 1 AND BELGENO IN (SELECT BELGE_NO FROM #TBELGE)
			GROUP BY BELGENO, SIPNO
			ORDER BY BELGE_NO, SIPARIS_NO;

			IF OBJECT_ID('tempdb..#TKULUME') IS NOT NULL DROP TABLE #TKULUME;
			SELECT BELGE_NO,
			       STUFF((SELECT ', ' + DF.ACIKLAMA
			              FROM #TDURUM AS D
			              INNER JOIN dbo.FNF_PICSEVKEMRIDURUM() AS DF ON DF.DURUM = D.DURUM
			              WHERE D.BELGE_NO = T.BELGE_NO
			              ORDER BY DF.SIRA
			              FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS DURUM_ACIKLAMA,
			       STUFF((SELECT ', ' + (K.ADI + ISNULL(' ' + K.SOYADI, ''))
			              FROM #TKULLANICI AS B
			              INNER JOIN NetFect.dbo.TBLKULLANICI AS K ON K.ID = B.KULLANICI
			              WHERE B.BELGE_NO = T.BELGE_NO
			              FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS KULLANICI_ADSOYAD,
			       STUFF((SELECT ', ' + SIPARIS_NO
			              FROM #TSIPARIS
			              WHERE BELGE_NO = T.BELGE_NO
			              FOR XML PATH(''),TYPE).value('(./text())[1]','NVARCHAR(MAX)'), 1, 2, '') AS SIPARIS_NO
			INTO #TKULUME 
			FROM #TBELGE AS T;

			CREATE NONCLUSTERED INDEX IND_KUMULE_1 ON #TKULUME (BELGE_NO) INCLUDE ([DURUM_ACIKLAMA],[KULLANICI_ADSOYAD],[SIPARIS_NO]);

			SELECT T.BELGE_NO, T.TARIH, T.SEVKTARIHI,
			       KUM.DURUM_ACIKLAMA, KUM.KULLANICI_ADSOYAD,
			       T.TOPLAM_MIKTAR, T.TOPLAM_TOPLANAN, T.TOPLAM_KALAN, T.TOPLAM_IRS_EDILEN, T.TOPLAM_IRS_EDILMEYEN,
			       T.ACIK1, T.ACIK2, T.ACIK3, T.ACIK4, T.ACIK5, T.ACIK6, T.ACIK7, T.ACIK8, T.ACIK9, T.ACIK10,
			       T.CARI_KODU, T.CARI_ADI, C.CARI_IL, C.CARI_ILCE,C.CARI_ADRES, T.KAPALI, T.KISMI_TESLIMAT,
			       C.GRUP_TANIMI, C.KOD1_TANIMI, C.KOD2_TANIMI, C.KOD3_TANIMI, C.KOD4_TANIMI, C.KOD5_TANIMI,
			       KUM.SIPARIS_NO,
			       C.KULL1N AS CARI_KULL1N,C.KULL2N AS CARI_KULL2N,C.KULL3N AS CARI_KULL3N,C.KULL4N AS CARI_KULL4N,C.KULL5N AS CARI_KULL5N,C.KULL6N AS CARI_KULL6N,C.KULL7N AS CARI_KULL7N,C.KULL8N AS CARI_KULL8N,
			       C.KULL1S AS CARI_KULL1S,C.KULL2S AS CARI_KULL2S,C.KULL3S AS CARI_KULL3S,C.KULL4S AS CARI_KULL4S,C.KULL5S AS CARI_KULL5S,C.KULL6S AS CARI_KULL6S,C.KULL7S AS CARI_KULL7S,C.KULL8S AS CARI_KULL8S,
			       C.EFATURA_CARISI
			FROM #TBELGE AS T
			LEFT OUTER JOIN #TKULUME AS KUM ON KUM.BELGE_NO = T.BELGE_NO
			LEFT OUTER JOIN #TCARI AS C ON T.CARI_KODU = C.CARI_KODU;";

            var param = new
            {
                DocumentNumbers = documentNumbers
            };

            var list = (await _con.QueryAsync<OrderManagementListModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;
        }
        public async Task<IEnumerable<ShipmentLineOrderModel>> GetShipmentOrderLinesAsync(string belgeNo)
        {
            string sql = @"
					SELECT 
					T.SUBE_KODU, 
					T.BELGENO AS BELGE_NO, 
					T.INCKEYNO, 
					T.SIPNO AS SEVKEMRI_NO, 
					T.SIPKONT AS SEVKEMRI_SIRA, 
					(CASE WHEN ISNULL(W_SEVK.BELGENO, '') <> '' THEN 'E' ELSE 'H' END) AS SEVKEMRI_VAR, 
					T.TESCARI AS TESLIM_CARI, 
					W_SEVK.SIPNO AS SIPARIS_NO, 
					W_SEVK.SIPKONT AS SIPARIS_SIRA, 
					T.SIRA, 
					T.STOKKODU AS STOK_KODU, 
					T.YAPKOD, 
					T.MIKTAR, 
					W_SIP.STHAR_BF, 
					W_SIP.STHAR_DOVFIAT,
					W_SIP.STHAR_DOVTIP,
					T.DEPO AS DEPO_KODU, 
					T.ACIK2 AS HUCRE_KODU, 
					(CASE WHEN T.IRSFLAG = 1 THEN 'E' ELSE 'H' END) AS IRSALIYE, 
					ISNULL(TPAKET.KILIT, 'H') AS PAKET_KILIT, 
					T.KAYITYAPANKUL, 
					T.KAYITTARIHI 
					FROM TBLSEVKTRA AS T 
					LEFT OUTER JOIN TBLSEVKTRA AS W_SEVK ON W_SEVK.BELGENO = T.SIPNO AND W_SEVK.SIRA = T.SIPKONT AND W_SEVK.TIP = 1 
					INNER JOIN TBLSIPATRA AS W_SIP ON W_SIP.FISNO = W_SEVK.SIPNO AND W_SIP.STOK_KODU = W_SEVK.STOKKODU AND W_SIP.SIRA = W_SEVK.SIPKONT 
					LEFT OUTER JOIN (SELECT D.ID, M.KILIT FROM TBLNF_PICPAKETDETAY AS D WITH (NOLOCK) 
					INNER JOIN TBLNF_PICPAKET AS M WITH (NOLOCK) ON D.PAKET_ID = M.ID) AS TPAKET ON T.I_YEDEK1 = TPAKET.ID WHERE T.TIP = 3 AND T.BELGENO=@BelgeNo";
            var param = new
            {
                BelgeNo = belgeNo
            };

            var list = (await _con.QueryAsync<ShipmentLineOrderModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;
        }
        public async Task<IEnumerable<WarehouseModel>> GetWarehousesAsync()
        {
            string sql = "SELECT DEPO_KODU, DEPO_TANIMI FROM VNF_DEPO ORDER BY DEPO_KODU";

            var list = (await _con.QueryAsync<WarehouseModel>(sql, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;

        }
        public async Task<IEnumerable<CustomerModel>> GetCustomersAsync()
        {
            string sql = "SELECT dbo.TRK(CARI_KOD) AS CARI_KOD, dbo.TRK(CARI_ISIM) AS CARI_ISIM FROM TBLCASABIT ORDER BY CARI_KOD ASC";

            var list = (await _con.QueryAsync<CustomerModel>(sql, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;

        }
        public async Task<IEnumerable<DocumentModel>> GetDocuments(string shipmentNo)
        {
            string sql = @"SELECT 
			BELGE_NO, 
			RESMI_BELGE_NO,
			(CASE BELGE_TIPI WHEN 'SF' THEN N'Fatura' WHEN 'SI' THEN N'İrsaliye' WHEN 'DG' THEN N'Transfer' ELSE BELGE_TIPI END) AS BELGE_TIPI,
			CARI_KODU, 
			CARI_ADI, 
			TARIH, 
			KAYITTARIHI, 
			ACIK1, 
			ACIK2, 
			ACIK3, 
			ACIK4, 
			ACIK5, 
			ACIK6, 
			ACIK7, 
			ACIK8, 
			ACIK9, 
			ACIK10, 
			ACIK11, 
			ACIK12, 
			ACIK13, 
			ACIK14, 
			ACIK15, 
			ACIK16
			FROM VNF_PICBELGE WHERE BELGE_TIPI IN ('SF', 'SI', 'DG') AND BELGE_NO IN (SELECT FISNO FROM TBLSTHAR WITH(NOLOCK)
			WHERE STHAR_FTIRSIP IN ('1', '3', '8') AND ISNUMERIC(AMBAR_KABULNO) = 1 AND CAST(AMBAR_KABULNO AS INT) IN 
			(SELECT INCKEYNO FROM VNF_PICSEVKEMRITOPLAMA WHERE SEVKEMRI_NO = @SEVKEMRI_NO))
			ORDER BY TARIH DESC, BELGE_NO DESC";

            var param = new
            {
                SEVKEMRI_NO = shipmentNo
            };

            var list = (await _con.QueryAsync<DocumentModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);
            return list;
        }

        public async Task<IEnumerable<ShipmentCollectionModel>> GetCollections(string shipmentNo)
        {
            string sql = @"SELECT T.INCKEYNO AS ID, ROW_NUMBER() OVER(ORDER BY T.SIRA) AS SIRA, T.STOK_KODU, ST.STOK_ADI, T.YAPKOD, YAP.YAPACIK,
				T.SIPARIS_NO + '-' + CAST(T.SIPARIS_SIRA AS VARCHAR) AS SIPARIS_NO,
				  T.SEVKEMRI_SIRA,
				T.MIKTAR, T.DEPO_KODU, T.HUCRE_KODU, T.IRSALIYE, T.KAYITYAPANKUL, T.KAYITTARIHI,
			 STUFF((SELECT ', ' + BARKOD1 FROM TBLNF_SEVKTRAEK WHERE REFID = T.INCKEYNO FOR XML PATH('')), 1, 2,'') AS BARKOD1,
			 STUFF((SELECT ', ' + BARKOD2 FROM TBLNF_SEVKTRAEK WHERE REFID = T.INCKEYNO FOR XML PATH('')), 1, 2,'') AS BARKOD2
			FROM TF_VW_PICSEVKEMRITOPLAMA AS T
			LEFT OUTER JOIN TF_VW_STOK AS ST ON ST.STOK_KODU = T.STOK_KODU
			LEFT OUTER JOIN TF_VW_YAPMAS AS YAP ON YAP.YAPKOD = T.YAPKOD
			WHERE T.SEVKEMRI_NO = @SEVKEMRI
			ORDER BY SIRA";

            var param = new
            {
                SEVKEMRI = shipmentNo
            };

            var list = (await _con.QueryAsync<ShipmentCollectionModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);
            return list;
        }
        public async Task<IEnumerable<ShipmentTemplateModel>> GetShipmentTemplates()
        {
            string sql = @"SELECT * FROM TBLEIRSABLON";

            var list = (await _con.QueryAsync<ShipmentTemplateModel>(sql, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);
            return list;
        }
        public async Task<bool> DeleteShipmentAsync(string belgeNo)
        {
            using var transaction = _con.BeginTransaction();

            try
            {
                string checkSql = @"
					SELECT COUNT(*) 
					FROM TBLSEVKTRA 
					WHERE BELGENO = @BELGENO AND (IRSFLAG = 1 OR F_YEDEK1 > 0 OR F_YEDEK2 > 0)";

                int relatedDocuments = await _con.ExecuteScalarAsync<int>(checkSql, new { BELGENO = belgeNo }, transaction);

                if (relatedDocuments > 0)
                {
                    throw new Exception("Bu sevk emrine bağlı fatura/irsaliye bulunduğu için silinemez.");
                }

                string deleteTraSql = @"
					DELETE FROM TBLSEVKTRA
					WHERE BELGENO = @BELGENO";

                await _con.ExecuteAsync(deleteTraSql, new { BELGENO = belgeNo }, transaction);

                string deleteMasSql = @"
					DELETE FROM TBLSEVKMAS
					WHERE BELGENO = @BELGENO";

                int affectedRows = await _con.ExecuteAsync(deleteMasSql, new { BELGENO = belgeNo }, transaction);

                transaction.Commit();

                return affectedRows > 0;
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
            finally
            {
                transaction.Dispose();
            }
        }
        public async Task<ShipmentModel?> GetShipmentAsync(string belgeNo)
        {
            string sqlHeader = @"
        SELECT 
            SUBE_KODU,
            TIP,
            BELGENO,
            TARIH,
            SEVKTARIHI,
            KOD1,
            KOD2,
			KAPALI = CASE WHEN C_YEDEK1 = 'E' THEN 1 ELSE 0 END,
            KISMI_TESLIMAT = CASE WHEN C_YEDEK2 = 'E' THEN 1 ELSE 0 END
        FROM TBLSEVKMAS
        WHERE BELGENO = @BELGENO";

            string sqlLines = @"
        SELECT 
            ID = INCKEYNO,
            SIRA,
            SIPNO,
            SIPKONT,
            TESCARI,
            TESCARIADI = (SELECT CARI_ISIM FROM TBLCASABIT WHERE CARI_KOD = TESCARI),
            STOKKODU,
            STOKADI = (SELECT STOK_ADI FROM TBLSTSABIT WHERE STOK_KODU = STOKKODU),
            DEPO = DEPO,
            MIKTAR
        FROM TBLSEVKTRA
        WHERE BELGENO = @BELGENO AND TIP = 1
        ORDER BY SIRA";

            using var multi = await _con.QueryMultipleAsync(sqlHeader + ";" + sqlLines, new { BELGENO = belgeNo });

            // HEADER
            var header = await multi.ReadFirstOrDefaultAsync<ShipmentModel>();
            if (header == null)
                return null;

            // LINES
            var lines = (await multi.ReadAsync<ShipmentLineModel>()).Select(NetsisUtils.FixAllStrings).ToList();

            header.ShipmentLines = lines;

            return header;
        }
        public async Task<OrderModel?> GetOrderDetailsAsync(string siparisNo)
        {
            string sqlMaster = @"
				SELECT TOP 1
				SIP.FATIRS_NO AS SIPARIS_NO,
				DBO.TRK(SIP.CARI_KODU) AS CARI_KODU,
				DBO.TRK(TBLCASABIT.CARI_ISIM) AS CARI_ISIM,
				SIP.TARIH,
				SIP.GENELTOPLAM,
				SIP.DOVIZTIP,
				SIP.KAPATILMIS,
				DBO.TRK(SIP.ACIKLAMA) AS ACIKLAMA,
				DBO.TRK(FEK.ACIK1) AS ACIKLAMA1,
				DBO.TRK(FEK.ACIK2) AS ACIKLAMA2,
				DBO.TRK(FEK.ACIK3) AS ACIKLAMA3,
				DBO.TRK(FEK.ACIK4) AS ACIKLAMA4,
				DBO.TRK(FEK.ACIK5) AS ACIKLAMA5,
				DBO.TRK(FEK.ACIK6) AS ACIKLAMA6,
				DBO.TRK(FEK.ACIK7) AS ACIKLAMA7,
				DBO.TRK(FEK.ACIK8) AS ACIKLAMA8,
				DBO.TRK(FEK.ACIK9) AS ACIKLAMA9,
				DBO.TRK(FEK.ACIK10) AS ACIKLAMA10,
				DBO.TRK(FEK.ACIK11) AS ACIKLAMA11,
				DBO.TRK(FEK.ACIK12) AS ACIKLAMA12,
				DBO.TRK(FEK.ACIK13) AS ACIKLAMA13,
				DBO.TRK(FEK.ACIK14) AS ACIKLAMA14,
				DBO.TRK(FEK.ACIK15) AS ACIKLAMA15,
				DBO.TRK(FEK.ACIK16) AS ACIKLAMA16,
				SIP.KOD1 AS KOD1,
				SIP.KOD2 AS KOD2,
				TEVKIFATCARPAN=ISNULL((SELECT TOP 1 CONVERT(DECIMAL(18,8),PAY)/CONVERT(DECIMAL(18,8),PAYDA) FROM TBLTEVKIFATKOD T WHERE T.OZELKOD=KOD2),0),
				TEVKIFATEFATKODU=(SELECT TOP 1 I_YEDEK3 FROM TBLTEVKIFATKOD T WHERE T.OZELKOD=KOD2)
				FROM TBLSIPAMAS SIP 
				INNER JOIN TBLCASABIT ON SIP.CARI_KODU = TBLCASABIT.CARI_KOD
				LEFT OUTER JOIN TBLFATUEK AS FEK ON FEK.FATIRSNO = SIP.FATIRS_NO AND FEK.CKOD = SIP.CARI_KODU AND FEK.FKOD = SIP.FTIRSIP
				WHERE FATIRS_NO = @siparisNo
			";

            var order = await _con.QueryFirstOrDefaultAsync<OrderModel>(sqlMaster, new { siparisNo });

            if (order == null)
                return null;

            string sqlLines = @"
				SELECT 
				TBLSIPATRA.FISNO AS SIPAROS_NO,
				TBLSIPATRA.SIRA,
				TBLSIPATRA.STOK_KODU,
				TBLSTSABIT.STOK_ADI,
				TBLSIPATRA.STHAR_GCMIK AS MIKTAR,
				(TBLSIPATRA.STHAR_GCMIK - ISNULL((SELECT SUM(YUKMIK) FROM TBLSEVKTRA WHERE SIPNO = TBLSIPATRA.FISNO AND STOKKODU = TBLSIPATRA.STOK_KODU), 0)) AS KALAN,
				TBLSIPATRA.STHAR_BF AS FIYAT,
				TBLSIPATRA.STHAR_NF * TBLSIPATRA.STHAR_GCMIK AS TUTAR

				FROM TBLSIPATRA
				INNER JOIN TBLSTSABIT ON TBLSIPATRA.STOK_KODU = TBLSTSABIT.STOK_KODU
				WHERE TBLSIPATRA.FISNO=@siparisNo
				ORDER BY SIRA
			";
            order.Lines = (await _con.QueryAsync<OrderLineModel>(sqlLines, new { siparisNo })).Select(NetsisUtils.FixAllStrings).ToList();

            return order;
        }

        public async Task<(List<ToplamaKayitModel> ToplamaKayitlari, List<NfSeriTempModel> Seriler)> GetBelgeOlusacakToplamaKalemleri(string sirket, List<string> listSevkEmriNo, List<int>? listeInc = null)
        {
            var sql = $"USE [{sirket}];\r\n";
            sql += "IF OBJECT_ID('TEMPDB..#TOPLAMA_KAYIT') IS NOT NULL DROP TABLE #TOPLAMA_KAYIT";
            sql += " SELECT T.INCKEYNO, T.BELGE_NO, T.TESLIM_CARI, SIPKALEM.TESLIM_CARI AS TESLIM_CARI2,";
            sql += " \t\tT.SIPARIS_NO, T.SIPARIS_SIRA, SIPKALEM.ID AS SIPINCKEY, SIPKALEM.PLASIYER_KODU,";
            sql += " \t\tT.STOK_KODU, ISNULL(SIPKALEM.KALEM_ADI, ST.STOK_ADI) AS STOK_ADI, T.YAPKOD, Y.YAPACIK, T.MIKTAR, SIPKALEM.MIKTAR AS SIPARIS_MIKTARI, SIPKALEM.MALFAZ_ISK_ADEDI AS MAL_FAZLASI,";
            sql += " \t\tT.DEPO_KODU, SIPKALEM.NET_FIYAT, SIPKALEM.BRUT_FIYAT, SIPKALEM.DOVIZ_TIPI, SIPKALEM.DOVIZ_FIYATI, SIPKALEM.KDV, SIPKALEM.PROJE_KODU,";
            sql += " \t\tSIPBELGE.KOSUL_KODU, SIPBELGE.KOSUL_TARIHI,";
            sql += " \t\tSIPBELGE.OZEL_KOD1, SIPBELGE.OZEL_KOD2,";
            sql += " \t\tSIPBELGE.GENISK1_TIPI, SIPBELGE.GENISK2_TIPI, SIPBELGE.GENISK3_TIPI,";
            sql += "         SIPBELGE.GENEL_ISKONTO1, SIPBELGE.GENEL_ISKONTO2, SIPBELGE.GENEL_ISKONTO3,";
            sql += "         SIPKALEM.ISKONTO1_ORANMI, SIPKALEM.ISK1, SIPKALEM.ISK2, SIPKALEM.ISK3, SIPKALEM.ISK4, SIPKALEM.ISK5, SIPKALEM.ISK6, SIPKALEM.ISK1_TIPI, SIPKALEM.ISK2_TIPI, SIPKALEM.ISK3_TIPI, SIPKALEM.ISK4_TIPI, SIPKALEM.ISK5_TIPI, SIPKALEM.ISK6_TIPI,";
            sql += " \t\t(CASE WHEN SIPKALEM.EKALAN_NEDEN = '1' AND ISNULL(SIPKALEM.EKALAN1, '') <> '' THEN 'E' ELSE 'H' END) AS STOK_ADI_DEGISTI,";
            sql += " \t\tSIPKALEM.EKALAN1, SIPKALEM.EKALAN2,";
            sql += " \t\tSIPKALEM.OLCU_BIRIM_KODU,";
            sql += " \t\tSIPKALEM.OLCU_BIRIM_CARPANI,";
            sql += " \t\tSIPKALEM.VADE_GUNU AS SIPARIS_VADE_GUNU,";
            sql += " \t\tSIPKALEM.VADE_TARIHI AS SIPARIS_VADE_TARIHI";
            sql += " INTO #TOPLAMA_KAYIT FROM VNF_PICSEVKEMRITOPLAMA AS T";
            sql += " INNER JOIN VNF_STOK AS ST ON T.STOK_KODU = ST.STOK_KODU";
            sql += " LEFT OUTER JOIN VNF_PICYAPLISTE AS Y ON T.STOK_KODU = Y.STOK_KODU AND T.YAPKOD = Y.YAPKOD";
            sql += " LEFT OUTER JOIN VNF_PICSIPARIS AS SIPBELGE ON SIPBELGE.SIPARIS_NO = T.SIPARIS_NO AND SIPBELGE.CARI_KODU = T.TESLIM_CARI AND SIPBELGE.SIPARIS_TIPI = 'MS'";
            sql += " LEFT OUTER JOIN VNF_PICSIPARISDETAY AS SIPKALEM ON SIPKALEM.SIPARIS_NO = T.SIPARIS_NO AND SIPKALEM.SIRA = T.SIPARIS_SIRA AND SIPKALEM.CARI_KODU = T.TESLIM_CARI AND SIPKALEM.SIPARIS_TIPI = 'MS'";
            sql += " WHERE T.IRSALIYE = 'H' AND T.SEVKEMRI_NO=@sevkEmirleri";
            if (listeInc != null)
            {
                sql += " AND T.INCKEYNO IN (";
                int num = checked(listeInc.Count - 1);
                int index = 0;
                while (index <= num)
                {
                    if (index > 0)
                        sql += ", ";
                    sql += listeInc[index].ToString();
                    checked { ++index; }
                }
                sql += ")";
            }
            sql += " ORDER BY T.SIPARIS_NO, T.SIPARIS_SIRA";
            sql += " SELECT *";
            sql += " FROM #TOPLAMA_KAYIT";

            var toplamaKiyatlari = await _con.QueryAsync<ToplamaKayitModel>(sql, new { sevkEmirleri = listSevkEmriNo });


            var sqlSeri = $"USE [{sirket}];\r\n";
            sqlSeri += " IF OBJECT_ID('TEMPDB..#TOPLAMA_KAYIT') IS NOT NULL DROP TABLE #TOPLAMA_KAYIT";
            sqlSeri += " SELECT T.INCKEYNO, T.BELGE_NO, T.TESLIM_CARI, SIPKALEM.TESLIM_CARI AS TESLIM_CARI2,";
            sqlSeri += " \t\tT.SIPARIS_NO, T.SIPARIS_SIRA, SIPKALEM.ID AS SIPINCKEY, SIPKALEM.PLASIYER_KODU,";
            sqlSeri += " \t\tT.STOK_KODU, ISNULL(SIPKALEM.KALEM_ADI, ST.STOK_ADI) AS STOK_ADI, T.YAPKOD, Y.YAPACIK, T.MIKTAR, SIPKALEM.MIKTAR AS SIPARIS_MIKTARI, SIPKALEM.MALFAZ_ISK_ADEDI AS MAL_FAZLASI,";
            sqlSeri += " \t\tT.DEPO_KODU, SIPKALEM.NET_FIYAT, SIPKALEM.BRUT_FIYAT, SIPKALEM.DOVIZ_TIPI, SIPKALEM.DOVIZ_FIYATI, SIPKALEM.KDV, SIPKALEM.PROJE_KODU,";
            sqlSeri += " \t\tSIPBELGE.KOSUL_KODU, SIPBELGE.KOSUL_TARIHI,";
            sqlSeri += " \t\tSIPBELGE.OZEL_KOD1, SIPBELGE.OZEL_KOD2,";
            sqlSeri += " \t\tSIPBELGE.GENISK1_TIPI, SIPBELGE.GENISK2_TIPI, SIPBELGE.GENISK3_TIPI,";
            sqlSeri += "         SIPBELGE.GENEL_ISKONTO1, SIPBELGE.GENEL_ISKONTO2, SIPBELGE.GENEL_ISKONTO3,";
            sqlSeri += "         SIPKALEM.ISKONTO1_ORANMI, SIPKALEM.ISK1, SIPKALEM.ISK2, SIPKALEM.ISK3, SIPKALEM.ISK4, SIPKALEM.ISK5, SIPKALEM.ISK6, SIPKALEM.ISK1_TIPI, SIPKALEM.ISK2_TIPI, SIPKALEM.ISK3_TIPI, SIPKALEM.ISK4_TIPI, SIPKALEM.ISK5_TIPI, SIPKALEM.ISK6_TIPI,";
            sqlSeri += " \t\t(CASE WHEN SIPKALEM.EKALAN_NEDEN = '1' AND ISNULL(SIPKALEM.EKALAN1, '') <> '' THEN 'E' ELSE 'H' END) AS STOK_ADI_DEGISTI,";
            sqlSeri += " \t\tSIPKALEM.EKALAN1, SIPKALEM.EKALAN2,";
            sqlSeri += " \t\tSIPKALEM.OLCU_BIRIM_KODU,";
            sqlSeri += " \t\tSIPKALEM.OLCU_BIRIM_CARPANI,";
            sqlSeri += " \t\tSIPKALEM.VADE_GUNU AS SIPARIS_VADE_GUNU,";
            sqlSeri += " \t\tSIPKALEM.VADE_TARIHI AS SIPARIS_VADE_TARIHI";
            sqlSeri += " INTO #TOPLAMA_KAYIT FROM VNF_PICSEVKEMRITOPLAMA AS T";
            sqlSeri += " INNER JOIN VNF_STOK AS ST ON T.STOK_KODU = ST.STOK_KODU";
            sqlSeri += " LEFT OUTER JOIN VNF_PICYAPLISTE AS Y ON T.STOK_KODU = Y.STOK_KODU AND T.YAPKOD = Y.YAPKOD";
            sqlSeri += " LEFT OUTER JOIN VNF_PICSIPARIS AS SIPBELGE ON SIPBELGE.SIPARIS_NO = T.SIPARIS_NO AND SIPBELGE.CARI_KODU = T.TESLIM_CARI AND SIPBELGE.SIPARIS_TIPI = 'MS'";
            sqlSeri += " LEFT OUTER JOIN VNF_PICSIPARISDETAY AS SIPKALEM ON SIPKALEM.SIPARIS_NO = T.SIPARIS_NO AND SIPKALEM.SIRA = T.SIPARIS_SIRA AND SIPKALEM.CARI_KODU = T.TESLIM_CARI AND SIPKALEM.SIPARIS_TIPI = 'MS'";
            sqlSeri += " WHERE T.IRSALIYE = 'H' AND T.SEVKEMRI_NO=@sevkEmirleri";
            if (listeInc != null)
            {
                sqlSeri += " AND T.INCKEYNO IN (";
                int num = checked(listeInc.Count - 1);
                int index = 0;
                while (index <= num)
                {
                    if (index > 0)
                        sqlSeri += ", ";
                    sqlSeri += listeInc[index].ToString();
                    checked { ++index; }
                }
                sqlSeri += ")";
            }
            sqlSeri += " ORDER BY T.SIPARIS_NO, T.SIPARIS_SIRA";
            sqlSeri += " SELECT *";
            sqlSeri += " FROM TBLNF_SERITEMP";
            sqlSeri += " WHERE BELGE_TIPI = 'SE' AND REF_ID IN (SELECT INCKEYNO FROM #TOPLAMA_KAYIT)";

            var seriler = await _con.QueryAsync<NfSeriTempModel>(sql, new { sevkEmirleri = listSevkEmriNo });

            return (toplamaKiyatlari.ToList(), seriler.ToList());
        }

        public async Task<bool> UpdateIrsaliyeSeri(string fisNo)
        {
            using var transaction = _con.BeginTransaction();

            try
            {
                string sql = @"
				UPDATE SERI
				SET 
					SERI.KAYIT_TIPI = 'A',
					SERI.BELGENO   = STHAR.FISNO,
					SERI.BELGETIP  = STHAR.STHAR_HTUR,
					SERI.STRA_INC  = STHAR.INCKEYNO
				FROM TBLSTHAR AS STHAR
				INNER JOIN TBLNF_SERITRAEK AS SERIEK 
					ON CAST(SERIEK.SEVKTRA_INC AS VARCHAR(MAX)) = STHAR.AMBAR_KABULNO
				INNER JOIN TBLSERITRA AS SERI 
					ON SERI.SIRA_NO = SERIEK.SERITRA_INC
				WHERE 
					STHAR.FISNO = @fisNo
					AND STHAR_FTIRSIP = 3
					AND STHAR.AMBAR_KABULNO IS NOT NULL
					AND ISNUMERIC(STHAR.AMBAR_KABULNO) = 1";

                int affectedRows = await _con.ExecuteAsync(
                    sql,
                    new { fisNo },
                    transaction
                );

                transaction.Commit();
                return affectedRows > 0;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        public async Task<bool> UpdateFaturaSeri(string fisNo)
        {
            using var transaction = _con.BeginTransaction();

            try
            {
                string sql = @"
				UPDATE SERI
				SET 
					SERI.KAYIT_TIPI = 'A',
					SERI.BELGENO   = STHAR.FISNO,
					SERI.BELGETIP  = STHAR.STHAR_HTUR,
					SERI.STRA_INC  = STHAR.INCKEYNO
				FROM TBLSTHAR AS STHAR
				INNER JOIN TBLNF_SERITRAEK AS SERIEK 
					ON CAST(SERIEK.SEVKTRA_INC AS VARCHAR(MAX)) = STHAR.AMBAR_KABULNO
				INNER JOIN TBLSERITRA AS SERI 
					ON SERI.SIRA_NO = SERIEK.SERITRA_INC
				WHERE 
					STHAR.FISNO = @fisNo
					AND STHAR_FTIRSIP = 1
					AND STHAR.AMBAR_KABULNO IS NOT NULL
					AND ISNUMERIC(STHAR.AMBAR_KABULNO) = 1";

                int affectedRows = await _con.ExecuteAsync(
                    sql,
                    new { fisNo },
                    transaction
                );

                transaction.Commit();
                return affectedRows > 0;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<List<SevktraModel>> GetSevktraList(string sevkNo)
        {
            string sql = @"
			SELECT 
			TBLSEVKTRA.SIPNO AS SIPARIS_NO,
			TBLSEVKTRA.SIRA,
			TBLSEVKTRA.STOKKODU AS STOK_KODU,
			TBLSTSABIT.STOK_ADI,
			TBLSEVKTRA.MIKTAR AS MIKTAR,
				CASE TBLSIPATRA.OLCUBR
					WHEN 1 THEN TBLSTSABIT.OLCU_BR1
					WHEN 2 THEN TBLSTSABIT.OLCU_BR2
					WHEN 3 THEN TBLSTSABIT.OLCU_BR3
					ELSE TBLSTSABIT.OLCU_BR1
				END  AS OLCUBR
			FROM TBLSEVKTRA
			INNER JOIN TBLSTSABIT ON TBLSEVKTRA.STOKKODU = TBLSTSABIT.STOK_KODU
			INNER JOIN TBLSIPATRA ON TBLSIPATRA.INCKEYNO = TBLSEVKTRA.INCKEYNO
			WHERE TBLSEVKTRA.BELGENO=@sevkNo
			ORDER BY SIRA";

            return (await _con.QueryAsync<SevktraModel>(sql, new { sevkNo })).Select(NetsisUtils.FixAllStrings).ToList();
        }

        public async Task<bool> UpdateOnayNum(string sevkInckeyNo, string stokKodu, int onayNum)
        {
            using var transaction = _con.BeginTransaction();

            try
            {
                string sql = @"UPDATE TBLSTHAR SET ONAYNUM=@onayNum WHERE YEDEK13=@sevkInckeyNo AND STOK_KODU=@stokKodu AND STHAR_FTIRSIP IN ('8','9') ;";

                int affectedRows = await _con.ExecuteAsync(
                    sql,
                    new { sevkInckeyNo, stokKodu, onayNum },
                    transaction
                );

                transaction.Commit();
                return affectedRows > 0;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}