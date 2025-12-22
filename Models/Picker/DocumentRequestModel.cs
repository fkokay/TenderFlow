using NetOpenX.Rest.Client.Model.NetOpenX;

namespace TenderFlow.Models.Picker
{
    public class DocumentRequestModel
    {
        public string? DocumentNumber { get; set; }
        public EWaybillInfo? EWaybillInfo { get; set; }
        public bool EInovice { get; set; }
    }
}
