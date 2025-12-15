namespace TenderFlow.Models
{
    using System;
    using System.ComponentModel.DataAnnotations.Schema;

    public class TenderRequiredDocument
    {
        public int Id { get; set; }

        public int TenderId { get; set; }

        public int DocumentId { get; set; }

        public bool IsMandatory { get; set; } = true;

        public bool Submitted { get; set; } = false;

        public DateTime? SubmissionDate { get; set; }

        //TenderDocument
        public string DocumentName { get; set; } = string.Empty;

        //Document File Info
        public string? FileName { get; set; }
        public int?  TenderRequiredDocumentFileId{ get; set; }
        public string? FileType { get; set; }
        public byte[]? FileContent { get; set; }
    }


}
