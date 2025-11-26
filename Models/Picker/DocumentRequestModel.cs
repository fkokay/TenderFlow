using NetOpenX.Rest.Client.Model.NetOpenX;

namespace TenderFlow.Models.Picker
{
    public class DocumentRequestModel
    {
        public List<string> DocumentNumbers { get; set; } = new List<string>(); 
        public EWaybillInfo? EWaybillInfo { get; set; }
    }
}
