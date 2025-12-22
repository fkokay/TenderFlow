using Quartz;

namespace TenderFlow.Jobs
{
    public abstract class ScopedJob : IJob
    {
        public IServiceScope? Scope { get; set; }   // JobFactory tarafından set edilir
        public abstract Task Execute(IJobExecutionContext context);
    }

}
