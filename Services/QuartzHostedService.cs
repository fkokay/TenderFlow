using Quartz;
using Quartz.Spi;
using TenderFlow.Jobs;

namespace TenderFlow.Services
{
    public class QuartzHostedService : IHostedService
    {
        private readonly ISchedulerFactory _schedulerFactory;
        private readonly IJobFactory _jobFactory;
        private IScheduler? _scheduler;

        public QuartzHostedService(ISchedulerFactory schedulerFactory, IJobFactory jobFactory)
        {
            _schedulerFactory = schedulerFactory;
            _jobFactory = jobFactory;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _scheduler = await _schedulerFactory.GetScheduler(cancellationToken);
            _scheduler.JobFactory = _jobFactory;

            await _scheduler.Start(cancellationToken);

            // JOB TANIMI
            var job = JobBuilder.Create<ShipmentJob>()
                .WithIdentity("ShipmentJob", "Jobs")
                .Build();

            // TRIGGER
            var trigger = TriggerBuilder.Create()
                .WithIdentity("ShipmentTrigger", "Triggers")
                .StartNow()
                .WithSimpleSchedule(x =>
                    x.WithIntervalInMinutes(1)
                     .RepeatForever())
                //.WithCronSchedule("0 0/1 * * * ?") // istersen cron
                .Build();

            await _scheduler.ScheduleJob(job, trigger, cancellationToken);
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_scheduler != null)
            {
                await _scheduler.Shutdown(waitForJobsToComplete: true, cancellationToken);
            }
        }
    }
}
