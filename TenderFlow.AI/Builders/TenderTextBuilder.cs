using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.AI.Builders
{
    public static class TenderTextBuilder
    {
        public static string BuildTenderText(Tender tender)
        {
            string finalGuaranteeAmount = tender.FinalGuarantee?.CommissionAmount.ToString() ?? "0";
            string finalGuaranteeRate = tender.FinalGuarantee?.CommissionRate.ToString() ?? "0";

            return $@"
                Sistem: TenderFlow
                Kaynak: Tender

                İhale:
                  Id: {tender.Id}
                  Kod: {tender.TenderCode}
                  Ad: {tender.TenderName}
                  Tür: {tender.TenderType}
                  Metod: {tender.TenderMethod}
                  Durum: {tender.TenderStatus}

                Tarih:
                  Başlangıç: {tender.TenderStartDate:yyyy-MM-dd}
                  Bitiş: {tender.TenderEndDate:yyyy-MM-dd}

                Teminat:
                  Tutar: {finalGuaranteeAmount}
                  Oran: {finalGuaranteeRate}
                ".Trim();
        }
    }
}
