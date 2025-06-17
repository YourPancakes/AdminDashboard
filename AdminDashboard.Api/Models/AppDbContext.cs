using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.Api.Models
{
    public class AppDbContext : DbContext
    {
        public DbSet<Client> Clients {  get; set; }
        public DbSet<Rate> Rates { get; set; }
        public DbSet<Payment> Payments { get; set; }


        public AppDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Client)
                .WithMany(c => c.Payments)
                .HasForeignKey(p => p.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Payment>()
                .Property(p => p.AmountT)
                .HasColumnType("decimal(15,2)");
            modelBuilder.Entity<Client>()
                .Property(p => p.BalanceT)
                .HasColumnType("decimal(15,2)");
            modelBuilder.Entity<Rate>()
                .Property(p => p.CurrentRate)
                .HasColumnType("decimal(15,2)");

            base.OnModelCreating(modelBuilder);
        }
    }
}
