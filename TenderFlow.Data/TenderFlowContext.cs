using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TenderFlow.Core.Domain.Entities;

namespace TenderFlow.Data
{
    public class TenderFlowContext : DbContext
    {
        public TenderFlowContext(DbContextOptions options) : base(options)
        {
        }

        protected TenderFlowContext()
        {
        }

        public DbSet<Asset> Assets { get; set; }
        public DbSet<DeviceServiceRecord> DeviceServiceRecords { get; set; }
        public DbSet<Firm> Firms { get; set; }
        public DbSet<Guarantee> Guarantees { get; set; }
        public DbSet<GuaranteeCommission> GuaranteeCommissions { get; set; }
        public DbSet<GuaranteeCommissionPeriod> GuaranteeCommissionPeriods { get; set; }
        public DbSet<MaintenancePlan> MaintenancePlans { get; set; }
        public DbSet<ServiceReplacedPart> ServiceReplacedParts { get; set; }
        public DbSet<Tender> Tenders { get; set; }
        public DbSet<TenderDevice> TenderDevices { get; set; }
        public DbSet<TenderDeviceService> TenderDeviceServices { get; set; }
        public DbSet<TenderDocument> TenderDocuments { get; set; }
        public DbSet<TenderDocumentFile> TenderDocumentFiles { get; set; }
        public DbSet<TenderExternalQuality> TenderExternalQualities { get; set; }
        public DbSet<TenderCapex> TenderCapex { get; set; }
        public DbSet<TenderOpex> TenderOpex { get; set; }
        public DbSet<TenderReaktif> TenderReaktifs { get; set; }
        public DbSet<TenderReaktifStatistics> TenderReaktifStatistics { get; set; }
        public DbSet<TenderRequiredDocument> TenderRequiredDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Asset
            modelBuilder.Entity<Asset>()
                .HasOne(a => a.Tender)
                .WithMany(t => t.Assets)
                .HasForeignKey(a => a.TenderId);

            modelBuilder.Entity<Asset>()
                .HasOne(a => a.Device)
                .WithMany(d => d.Assets)
                .HasForeignKey(a => a.DeviceId);


            // DeviceServiceRecord
            modelBuilder.Entity<DeviceServiceRecord>()
                .HasOne(s => s.Device)
                .WithMany(d => d.ServiceRecords)
                .HasForeignKey(s => s.DeviceId);

            // ServiceReplacedPart
            modelBuilder.Entity<ServiceReplacedPart>()
                .HasOne(p => p.ServiceRecord)
                .WithMany(r => r.ReplacedParts)
                .HasForeignKey(p => p.ServiceRecordId);

            // Guarantee
            modelBuilder.Entity<Guarantee>()
                .HasOne(g => g.Firm)
                .WithMany(f => f.Guarantees)
                .HasForeignKey(g => g.FirmId);


            modelBuilder.Entity<Guarantee>()
                .HasOne(g => g.CommissionPeriod)
                .WithMany(c => c.Guarantees)
                .HasForeignKey(g => g.CommissionPeriodId);

            // Tender
            modelBuilder.Entity<Tender>()
                .HasOne(t => t.Firm)
                .WithMany(f => f.Tenders)
                .HasForeignKey(t => t.FirmId);

            modelBuilder.Entity<Tender>()
                .HasOne(t => t.TemporaryGuarantee)
                .WithMany(g => g.TemporaryGuaranteeTenders)
                .HasForeignKey(t => t.TemporaryGuaranteeRateId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Tender>()
                .HasOne(t => t.FinalGuarantee)
                .WithMany(g => g.FinalGuaranteeTenders)
                .HasForeignKey(t => t.FinalGuaranteeRateId)
                .OnDelete(DeleteBehavior.Restrict);

            // TenderDevice
            modelBuilder.Entity<TenderDevice>()
                .HasOne(d => d.Tender)
                .WithMany(t => t.Devices)
                .HasForeignKey(d => d.TenderId);

            // TenderDeviceService
            modelBuilder.Entity<TenderDeviceService>()
                .HasOne(s => s.Device)
                .WithMany(d => d.Services)
                .HasForeignKey(s => s.DeviceId);

            // TenderCapex
            modelBuilder.Entity<TenderCapex>()
                .HasOne(c => c.Tender)
                .WithMany(t => t.Capex)
                .HasForeignKey(c => c.TenderId);

            // TenderOpex
            modelBuilder.Entity<TenderOpex>()
                .HasOne(o => o.Tender)
                .WithMany(t => t.Opex)
                .HasForeignKey(o => o.TenderId);

            // TenderReaktif
            modelBuilder.Entity<TenderReaktif>()
                .HasOne(r => r.Tender)
                .WithMany(t => t.Reaktifs)
                .HasForeignKey(r => r.TenderId);

            // TenderReaktifStatistics
            modelBuilder.Entity<TenderReaktifStatistics>()
                .HasOne(s => s.TenderReaktif)
                .WithMany(r => r.Statistics)
                .HasForeignKey(s => s.TenderTestId);

            // TenderRequiredDocument
            modelBuilder.Entity<TenderRequiredDocument>()
                .HasOne(rd => rd.Tender)
                .WithMany(t => t.RequiredDocuments)
                .HasForeignKey(rd => rd.TenderId);

            modelBuilder.Entity<TenderRequiredDocument>()
                .HasOne(rd => rd.Document)
                .WithMany(d => d.RequiredDocuments)
                .HasForeignKey(rd => rd.DocumentId);

            // TenderDocumentFile
            modelBuilder.Entity<TenderDocumentFile>()
                .HasOne(df => df.RequiredDocument)
                .WithMany(rd => rd.Files)
                .HasForeignKey(df => df.TenderRequiredDocumentId);

            // TenderExternalQuality
            modelBuilder.Entity<TenderExternalQuality>()
                .HasOne(eq => eq.Tender)
                .WithMany(t => t.ExternalQualities)
                .HasForeignKey(eq => eq.TenderId);


            modelBuilder.Entity<GuaranteeCommission>().HasKey(x => x.Id);

            modelBuilder.Entity<GuaranteeCommission>().Property(x => x.Currency)
                   .HasMaxLength(3)
                   .IsRequired()
                   .HasDefaultValue("TRY");

            modelBuilder.Entity<GuaranteeCommission>().Property(x => x.PaymentStatus)
                   .HasMaxLength(20)
                   .HasDefaultValue("Beklemede");

            modelBuilder.Entity<GuaranteeCommission>().Property(x => x.CommissionRate)
                   .HasColumnType("decimal(9,4)");

            modelBuilder.Entity<GuaranteeCommission>().Property(x => x.CommissionAmount)
                   .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<GuaranteeCommission>().Property(x => x.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<GuaranteeCommission>().HasOne(x => x.Guarantee)
                   .WithMany()
                   .HasForeignKey(x => x.GuaranteeId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
