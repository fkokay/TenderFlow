using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Models;
using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.AI.Builders
{
    public static class TenderTextBuilder
    {
        public static string BuildTenderText(TenderModel t)
        {
            var sb = new StringBuilder();

            Add(sb, "Firma", t.FirmName);
            Add(sb, "İhale Kodu", t.TenderCode);
            Add(sb, "İhale Adı", t.TenderName);
            Add(sb, "Kamu Kurumu", t.PublicAuthorityName);
            Add(sb, "Tip", t.TenderType);
            Add(sb, "Yöntem", t.TenderMethod);

            AddDate(sb, "Başlangıç Tarihi", t.TenderStartDate);
            AddDate(sb, "Bitiş Tarihi", t.TenderEndDate);
            AddDate(sb, "İlan Tarihi", t.AnnouncementDate);

            AddAmount(sb, "Tutar", t.TenderAmount, t.Currency);

            AddRate(sb, "Geçici Teminat Oranı", t.TemporaryGuaranteeRateId);
            AddRate(sb, "Kesin Teminat Oranı", t.FinalGuaranteeRateId);

            return sb.ToString();
        }
        public static string BuildDeviceText(IEnumerable<TenderDeviceModel> devices)
        {
            var sb = new StringBuilder();

            foreach (var d in devices)
            {
                sb.AppendLine("Cihaz:");
                Add(sb, "Stok Kodu", d.StockCode);
                Add(sb, "Tip", d.SupplyType);
                Add(sb, "Miktar", d.Quantity.ToString());

                AddPrice(sb, "Satınalma Fiyatı", d.PurchasePrice, d.Currency);
                AddPrice(sb, "Kira Birim Fiyatı", d.RentUnitPrice, d.Currency);
                AddPrice(sb, "Servis Birim Fiyatı", d.ServiceUnitPrice, d.Currency);
                AddPrice(sb, "Link Birim Fiyatı", d.LinkUnitPrice, d.Currency);

                Add(sb, "Müşteri Kodu", d.CustomerCode);

                sb.AppendLine();
            }

            return sb.ToString();
        }

        private static void Add(StringBuilder sb, string label, string? value)
        {
            if (!string.IsNullOrWhiteSpace(value))
                sb.AppendLine($"{label}: {value}");
        }

        private static void AddDate(StringBuilder sb, string label, DateTime? dt)
        {
            if (dt.HasValue)
                sb.AppendLine($"{label}: {dt:dd.MM.yyyy}");
        }

        private static void AddAmount(StringBuilder sb, string label, decimal? amount, string? currency)
        {
            if (amount.HasValue && amount > 0)
            {
                string cur = string.IsNullOrWhiteSpace(currency) ? "" : $" {currency}";
                sb.AppendLine($"{label}: {amount.Value:N2}{cur}");
            }
        }

        private static void AddRate(StringBuilder sb, string label, int? rate)
        {
            if (rate.HasValue && rate > 0)
                sb.AppendLine($"{label}: %{rate}");
        }

        private static void AddPrice(StringBuilder sb, string label, decimal value, string? currency)
        {
            if (value > 0)
            {
                string cur = string.IsNullOrWhiteSpace(currency) ? "" : $" {currency}";
                sb.AppendLine($"{label}: {value:N2}{cur}");
            }
        }
    }
}
