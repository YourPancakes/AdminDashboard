using AdminDashboard.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminDashboard.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext db)
        {
            db.Database.Migrate();
            if (db.Clients.Any()) return;

            var clients = new[]
            {
                new Client { Id = 1, Name = "Serafima", Email = "Serafima@example.com", BalanceT = 100m },
                new Client { Id = 2, Name = "Alice", Email = "alice@example.com", BalanceT = 100m },
                new Client { Id = 3, Name = "Bob", Email = "bob@example.com", BalanceT = 200m }
            };
            db.Clients.AddRange(clients);

            var payments = new[]
{
                new Payment { Id = 1, ClientId = 1, AmountT = 10m, Timestamp = DateTime.UtcNow.AddHours(-5) },
                new Payment { Id = 2, ClientId = 2, AmountT = 20m, Timestamp = DateTime.UtcNow.AddHours(-4) },
                new Payment { Id = 3, ClientId = 3, AmountT = 30m, Timestamp = DateTime.UtcNow.AddHours(-3) },
                new Payment { Id = 4, ClientId = 1, AmountT = 40m, Timestamp = DateTime.UtcNow.AddHours(-2) },
                new Payment { Id = 5, ClientId = 2, AmountT = 50m, Timestamp = DateTime.UtcNow.AddHours(-1) }
            };
            db.Payments.AddRange(payments);

            var rate = new Rate { Id = 1, CurrentRate = 10m, UpdatedAt = DateTime.UtcNow };
            db.Rates.Add(rate);

            db.SaveChanges();
        }
    }
}
