using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.Services
{
    public static class TenderTextBuilder
    {
        public static string BuildTenderText(Tender tender)
        {
            return $@"
                Sistem: TenderFlow
                Kaynak: Tender
                İhale Id: {tender.Id}
                İhale No: {tender.TenderCode}
                Açıklama: {tender.TenderName}
                Tür: {tender.TenderType}
                Metod: {tender.TenderMethod}
                Teminat Tutarı: {tender.FinalGuarantee?.CommissionAmount}
                Teminat Oranı: {tender.FinalGuarantee?.CommissionRate}
                Başlangıç: {tender.TenderStartDate:yyyy-MM-dd}
                Bitiş: {tender.TenderEndDate:yyyy-MM-dd}
                Durum: {tender.TenderStatus}
            ";
        }
    }

}
