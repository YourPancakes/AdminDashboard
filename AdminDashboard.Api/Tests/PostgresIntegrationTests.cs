using AdminDashboard.Api.Data;
using AdminDashboard.Api.Models;
using Xunit;
using Microsoft.EntityFrameworkCore;

public class PostgresIntegrationTests : IDisposable
{
    private readonly AppDbContext _db;

    public PostgresIntegrationTests()
    {
        var builder = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false);
        var config = builder.Build();
        var conn = config.GetConnectionString("Default");

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(conn)
            .Options;

        _db = new AppDbContext(options);
        _db.Database.EnsureDeleted();
        _db.Database.Migrate();
        DbSeeder.Seed(_db);
    }

    [Fact]
    public void Seed_Should_Create_3_Clients_5_Payments_1_Rate()
    {
        Assert.Equal(3, _db.Clients.Count());
        Assert.Equal(5, _db.Payments.Count());
        Assert.Single(_db.Rates);
    }

    public void Dispose()
    {
        _db.Dispose();
    }
}
