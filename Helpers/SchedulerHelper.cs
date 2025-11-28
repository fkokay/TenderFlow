using Quartz;
using Quartz.Impl;
using TenderFlow.Jobs;

namespace TenderFlow.Helpers
{
    public static class SchedulerHelper
    {
        public static async Task SchedulerSetup()
        {
            var scheduler = await new StdSchedulerFactory().GetScheduler();
            await scheduler.Start();

            var shipmentJob = JobBuilder.Create<ShipmentJob>()
                .WithIdentity("ShipmentJob", "Jobs")
                .Build();

            var trigger = TriggerBuilder.Create()
                .WithIdentity("ShipmentTrigger", "Triggers")
                .StartNow()
                .WithSimpleSchedule(builder =>
                    builder.WithIntervalInMinutes(1)
                           .RepeatForever()
                )
                //.WithCronSchedule("0 0/1 * * * ?")  // Cron alternatifi
                .Build();

            await scheduler.ScheduleJob(shipmentJob, trigger);
        }
    }
}
