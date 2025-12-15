using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
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

        public async Task<IEnumerable<ShipmentOrderModel>> GetShipmentOrdersAsync(string cariKodu, DateTime? startDate = null, DateTime? endDate = null, string? depo = null, bool? hasBalance = null)
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
			    FROM VNF_SIPARISDETAY AS SIP
			    LEFT JOIN (
			        SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			        FROM VNF_PICSEVKEMRIDETAY
			        GROUP BY SIPARIS_NO, SIPARIS_SIRA
			    ) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			    LEFT JOIN VNF_STOKBAKIYE AS BAK 
			      ON BAK.STOK_KODU = SIP.STOK_KODU AND ISNULL(BAK.YAPKOD, '') = ISNULL(SIP.YAPKOD, '') 
			      AND BAK.DEPO_KODU = SIP.DEPO_KODU
			    WHERE SIP.BELGE_TIPI = 'MS' 
			      AND SIP.KAPALI = 'H' 
			      AND SIP.KALAN - ISNULL(SEVK.MIKTAR, 0) > 0
			      AND (@BASTAR IS NULL OR ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH) >= @BASTAR)
			      AND (@BITTAR IS NULL OR ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH) <= @BITTAR)
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
			       SIP.DEPO_KODU, DEPO.DEPO_TANIMI, SIP.PROJE_KODU, SIP.EKALAN1, SIP.EKALAN2, SIP.DEPO_BAKIYE
			FROM SONUC AS SIP
			INNER JOIN VNF_SIPARIS AS MAS ON MAS.BELGE_NO = SIP.BELGE_NO AND MAS.BELGE_TIPI = SIP.BELGE_TIPI AND MAS.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN VNF_CARI AS CARI ON CARI.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN VNF_CARI AS CARI_TESLIM ON CARI_TESLIM.CARI_KODU = SIP.TESLIM_CARI_KODU
			LEFT JOIN VNF_STOK AS STOK ON STOK.STOK_KODU = SIP.STOK_KODU
			LEFT JOIN VNF_DEPO AS DEPO ON DEPO.DEPO_KODU = SIP.DEPO_KODU
			LEFT JOIN VNF_YAPMAS AS YAP ON YAP.YAPKOD = SIP.YAPKOD
			LEFT JOIN (
			    SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			    FROM VNF_PICSEVKEMRIDETAY
			    GROUP BY SIPARIS_NO, SIPARIS_SIRA
			) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			LEFT JOIN VNF_PLASIYER AS PL ON PL.PLASIYER_KODU = SIP.PLASIYER_KODU
			ORDER BY ISNULL(SIP.TESLIM_TARIHI, SIP.TARIH), SIP.BELGE_NO, SIP.SIRA";

            var param = new
            {
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
			    FROM VNF_SIPARISDETAY AS SIP
			    LEFT JOIN (
			        SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			        FROM VNF_PICSEVKEMRIDETAY
			        GROUP BY SIPARIS_NO, SIPARIS_SIRA
			    ) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			    LEFT JOIN VNF_STOKBAKIYE AS BAK 
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
			INNER JOIN VNF_SIPARIS AS MAS ON MAS.BELGE_NO = SIP.BELGE_NO AND MAS.BELGE_TIPI = SIP.BELGE_TIPI AND MAS.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN VNF_CARI AS CARI ON CARI.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN VNF_CARI AS CARI_TESLIM ON CARI_TESLIM.CARI_KODU = SIP.TESLIM_CARI_KODU
			LEFT JOIN VNF_STOK AS STOK ON STOK.STOK_KODU = SIP.STOK_KODU
			LEFT JOIN VNF_DEPO AS DEPO ON DEPO.DEPO_KODU = SIP.DEPO_KODU
			LEFT JOIN VNF_YAPMAS AS YAP ON YAP.YAPKOD = SIP.YAPKOD
			LEFT JOIN (
			    SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			    FROM VNF_PICSEVKEMRIDETAY
			    GROUP BY SIPARIS_NO, SIPARIS_SIRA
			) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			LEFT JOIN VNF_PLASIYER AS PL ON PL.PLASIYER_KODU = SIP.PLASIYER_KODU
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
			    FROM VNF_SIPARISDETAY AS SIP
			    LEFT JOIN (
			        SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			        FROM VNF_PICSEVKEMRIDETAY
			        GROUP BY SIPARIS_NO, SIPARIS_SIRA
			    ) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			    LEFT JOIN VNF_STOKBAKIYE AS BAK 
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
			INNER JOIN VNF_SIPARIS AS MAS ON MAS.BELGE_NO = SIP.BELGE_NO AND MAS.BELGE_TIPI = SIP.BELGE_TIPI AND MAS.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN VNF_CARI AS CARI ON CARI.CARI_KODU = SIP.CARI_KODU
			LEFT JOIN VNF_CARI AS CARI_TESLIM ON CARI_TESLIM.CARI_KODU = SIP.TESLIM_CARI_KODU
			LEFT JOIN VNF_STOK AS STOK ON STOK.STOK_KODU = SIP.STOK_KODU
			LEFT JOIN VNF_DEPO AS DEPO ON DEPO.DEPO_KODU = SIP.DEPO_KODU
			LEFT JOIN VNF_YAPMAS AS YAP ON YAP.YAPKOD = SIP.YAPKOD
			LEFT JOIN (
			    SELECT SIPARIS_NO, SIPARIS_SIRA, SUM(MIKTAR - IRS_EDILEN) AS MIKTAR
			    FROM VNF_PICSEVKEMRIDETAY
			    GROUP BY SIPARIS_NO, SIPARIS_SIRA
			) AS SEVK ON SEVK.SIPARIS_NO = SIP.BELGE_NO AND SEVK.SIPARIS_SIRA = SIP.SIRA
			LEFT JOIN VNF_PLASIYER AS PL ON PL.PLASIYER_KODU = SIP.PLASIYER_KODU
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
        public async Task<IEnumerable<ShipmentOrderManagementModel>> GetShipmentManagementsAsync(DateTime? startDate = null, DateTime? endDate = null, int status = 0, bool showCompleted = false)
        {

            string sql = @"
			USE [MAKROLAB25];
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
					C.GRUP_TANIMI, C.KOD1_TANIMI, C.KOD2_TANIMI, C.KOD3_TANIMI, C.KOD4_TANIMI, C.KOD5_TANIMI,
					KUM.SIPARIS_NO,
					C.KULL1N AS CARI_KULL1N,C.KULL2N AS CARI_KULL2N,C.KULL3N AS CARI_KULL3N,C.KULL4N AS CARI_KULL4N,C.KULL5N AS CARI_KULL5N,C.KULL6N AS CARI_KULL6N,C.KULL7N AS CARI_KULL7N,C.KULL8N AS CARI_KULL8N,
					C.KULL1S AS CARI_KULL1S,C.KULL2S AS CARI_KULL2S,C.KULL3S AS CARI_KULL3S,C.KULL4S AS CARI_KULL4S,C.KULL5S AS CARI_KULL5S,C.KULL6S AS CARI_KULL6S,C.KULL7S AS CARI_KULL7S,C.KULL8S AS CARI_KULL8S,
					C.EFATURA_CARISI
			FROM #TBELGE AS T
			LEFT OUTER JOIN #TKULUME AS KUM ON KUM.BELGE_NO = T.BELGE_NO
			LEFT OUTER JOIN #TCARI AS C ON T.CARI_KODU = C.CARI_KODU";

            var param = new
            {
                StartDate = startDate,
                EndDate = endDate,
            };

            var list = (await _con.QueryAsync<ShipmentOrderManagementModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

            return list;
        }
        public async Task<IEnumerable<ShipmentOrderManagementModel>> GetShipmentManagementsByDocumentNumbersAsync(List<string> documentNumbers)
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
			       C.CARI_IL, C.CARI_ILCE,
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
			       T.CARI_KODU, T.CARI_ADI, T.KAPALI, T.KISMI_TESLIMAT,
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

            var list = (await _con.QueryAsync<ShipmentOrderManagementModel>(sql, param, commandTimeout: 120)).Select(NetsisUtils.FixAllStrings);

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
            KAPALI = C_YEDEK1,
            KISMI_TESLIMAT = C_YEDEK2
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
        WHERE BELGENO = @BELGENO
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

        public async Task<OrderModel> GetOrderDetailsAsync(string siparisNo)
        {
            string sqlMaster = @"
				SELECT TOP 1
				TBLSIPAMAS.FATIRS_NO AS SIPARIS_NO,
				DBO.TRK(TBLSIPAMAS.CARI_KODU) AS CARI_KODU,
				DBO.TRK(TBLCASABIT.CARI_ISIM) AS CARI_ISIM,
				TBLSIPAMAS.TARIH,
				DBO.TRK(TBLSIPAMAS.ACIKLAMA) AS ACIKLAMA,
				TBLSIPAMAS.GENELTOPLAM,
				TBLSIPAMAS.DOVIZTIP,
				TBLSIPAMAS.KAPATILMIS

				FROM TBLSIPAMAS 
				INNER JOIN TBLCASABIT ON TBLSIPAMAS.CARI_KODU = TBLCASABIT.CARI_KOD
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
    }
}