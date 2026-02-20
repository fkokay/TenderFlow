using NetOpenX.Rest.Client.Model.NetOpenX;

namespace TenderFlow.Models.Picker
{
    public class DocumentRequestModel
    {
        public List<string> SevkEmirNumaralari { get; set; } = new();
        public EWaybillInfo? EWaybillInfo { get; set; }
        public bool EInovice { get; set; }
        public int DesingNo { get; set; }
    }
}
