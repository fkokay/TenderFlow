using Quartz;
using Quartz.Spi;
using Microsoft.Extensions.DependencyInjection;
using TenderFlow.Jobs;

public class QuartzJobFactory : IJobFactory
{
    private readonly IServiceScopeFactory _scopeFactory;

    public QuartzJobFactory(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public IJob NewJob(TriggerFiredBundle bundle, IScheduler scheduler)
    {
        // Her job için yeni scope oluştur
        var scope = _scopeFactory.CreateScope();

        try
        {
            // Job instance oluştur
            var job = (IJob)scope.ServiceProvider.GetRequiredService(bundle.JobDetail.JobType);

            // Scope’u job içine ekle ki ReturnJob'da dispose edebilelim
            if (job is ScopedJob scopedJob)
            {
                scopedJob.Scope = scope;
            }

            return job;
        }
        catch
        {
            // Fail olursa scope'u kapat
            scope.Dispose();
            throw;
        }
    }

    public void ReturnJob(IJob job)
    {
        // Scope varsa dispose et
        if (job is ScopedJob scopedJob && scopedJob.Scope != null)
        {
            scopedJob.Scope.Dispose();
        }
    }
}
