using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.AI.Models;

namespace TenderFlow.AI.Builders
{
    public static class GuaranteeTextBuilder
    {
        public static string BuildGuaranteeText(GuaranteeModel guarantee)
        {
            var sb = new StringBuilder();

            sb.AppendLine("Teminat:");

            Add(sb, "Firma", guarantee.FirmName);
            Add(sb, "Konu", guarantee.Subject);
            Add(sb, "Tür", guarantee.GuaranteeType);
            Add(sb, "Form", guarantee.GuaranteeForm);
            Add(sb, "Mektup No", guarantee.GuaranteeNumber);

            AddAmount(sb, "Tutar", guarantee.GuaranteeAmount, guarantee.Currency);
            AddRate(sb, "Komisyon Oranı", guarantee.CommissionRate);
            AddAmount(sb, "Komisyon Tutarı", guarantee.CommissionAmount, guarantee.Currency);

            Add(sb, "Komisyon Süresi", guarantee.GuaranteeCommissionPeriodName);

            AddDate(sb, "Teminat Tarihi", guarantee.GuaranteeDate);
            AddDate(sb, "Vade Tarihi", guarantee.ExpiryDate);

            Add(sb, "Banka", guarantee.BankName);
            Add(sb, "Şube", guarantee.BankBranchName);
            Add(sb, "Takasbank Ref", guarantee.TakasbankReferenceNo);

            Add(sb, "Kamu Kurumu", guarantee.PublicAuthorityName);

            sb.AppendLine();

            return sb.ToString();
        }

        private static void Add(StringBuilder sb, string label, string? value)
        {
            if (!string.IsNullOrWhiteSpace(value))
                sb.AppendLine($"{label}: {value}");
        }

        private static void AddRate(StringBuilder sb, string label, decimal value)
        {
            if (value > 0)
                sb.AppendLine($"{label}: %{value}");
        }

        private static void AddAmount(StringBuilder sb, string label, decimal value, string? currency)
        {
            if (value > 0)
            {
                string cur = string.IsNullOrWhiteSpace(currency) ? "" : $" {currency}";
                sb.AppendLine($"{label}: {value:N2}{cur}");
            }
        }

        private static void AddDate(StringBuilder sb, string label, DateTime? date)
        {
            if (date != null)
                sb.AppendLine($"{label}: {date:dd.MM.yyyy}");
        }
    }
}
