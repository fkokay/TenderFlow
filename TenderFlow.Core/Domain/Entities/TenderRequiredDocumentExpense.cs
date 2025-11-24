using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace TenderFlow.Core.Domain.Entities
{
    [Table("TenderRequiredDocumentExpense")]
    public class TenderRequiredDocumentExpense : BaseEntity
    {
        public int TenderRequiredDocumentId { get; set; }
        public string ExpenseType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "TRY";
        public bool Paid { get; set; }
        public DateTime? PaymentDate {  get; set; }
        public string? Note { get; set; }
    }
}
