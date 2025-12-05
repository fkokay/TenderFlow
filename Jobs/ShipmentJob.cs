using NetOpenX.Rest.Client;
using NetOpenX.Rest.Client.BLL;
using NetOpenX.Rest.Client.Model;
using NetOpenX.Rest.Client.Model.Enums;
using NetOpenX.Rest.Client.Model.NetOpenX;
using Quartz;
using TenderFlow.Core.Domain.Entities;
using TenderFlow.Data;
using TenderFlow.Netsis;

namespace TenderFlow.Jobs
{
    [DisallowConcurrentExecution]
    public class ShipmentJob : ScopedJob
    {
        private readonly TenderFlowContext _context;
        public ShipmentJob(TenderFlowContext context)
        {
            _context = context;
        }

        public override Task Execute(IJobExecutionContext context)
        {
            return Task.CompletedTask;
        }
    }
}
