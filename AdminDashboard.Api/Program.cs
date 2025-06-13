using AdminDashboard.Api.Data;
using AdminDashboard.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Npgsql.EntityFrameworkCore.PostgreSQL;


var builder = WebApplication.CreateBuilder(args);

var jwtCfg = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtCfg["Key"]!);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(opts =>
  {
      opts.RequireHttpsMetadata = false;
      opts.SaveToken = true;
      opts.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = jwtCfg["Issuer"],
          ValidAudience = jwtCfg["Audience"],
          IssuerSigningKey = new SymmetricSecurityKey(key),
      };
  });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
          .AllowAnyOrigin()    
          .AllowAnyHeader()
          .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

using var scope = app.Services.CreateScope();
DbSeeder.Seed(scope.ServiceProvider.GetRequiredService<AppDbContext>());


app.MapPost("/auth/login", (LoginRequest req) =>
{
    if (req.Email != "admin@mirra.dev" || req.Pwd != "admin123")
        return Results.Unauthorized();

    var jwtCfg = builder.Configuration.GetSection("Jwt");
    var key = Encoding.UTF8.GetBytes(jwtCfg["Key"]!);

    var token = new JwtSecurityToken(
        issuer: jwtCfg["Issuer"],
        audience: jwtCfg["Audience"],
        claims: new[] { new Claim(ClaimTypes.Email, req.Email) },
        expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtCfg["ExpireMinutes"]!)),
        signingCredentials: new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256
        )
    );

    string jwt = new JwtSecurityTokenHandler().WriteToken(token);
    return Results.Ok(new { token = jwt });
});


app.MapGet("/clients", async (AppDbContext db) =>
{
    var clients = await db.Clients
        .Select(c => new ClientWithPaymentsDto(
            c.Id,
            c.Name,
            c.Email,
            c.BalanceT,
            c.Payments
             .Select(p => new PaymentIdDto(p.Id))
             .ToList()
        ))
        .ToListAsync();

    return Results.Ok(clients);
}).RequireAuthorization();


app.MapPost("/clients", async (ClientUpsertDto dto, AppDbContext db) =>
{
    var client = new Client { Name = dto.Name, Email = dto.Email, BalanceT = dto.BalanceT };
    db.Clients.Add(client);
    await db.SaveChangesAsync();
    return Results.Created($"/clients/{client.Id}", client);
}).RequireAuthorization();


app.MapPut("/clients/{id:int}", async (int id, ClientUpsertDto dto, AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client is null) return Results.NotFound();
    client.Name = dto.Name;
    client.Email = dto.Email;
    client.BalanceT = dto.BalanceT;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();


app.MapDelete("/clients/{id:int}", async (int id, AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client is null) return Results.NotFound();
    db.Clients.Remove(client);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();


app.MapGet("/payments", async (int? take, AppDbContext db) =>
{
    var count = take ?? 5;
    var payments = await db.Payments
        .OrderByDescending(p => p.Timestamp)
        .Take(count)
        .Include(p => p.Client)
        .Select(p => new PaymentDto(
            p.Id,
            p.ClientId,
            p.AmountT,
            p.Timestamp,
            new ClientDto(p.Client!.Id, p.Client.Name, p.Client.Email, p.Client.BalanceT)
        ))
        .ToListAsync();

    return Results.Ok(payments);
}).RequireAuthorization();

app.MapGet("/clients/{id:int}/payments", async (int id, AppDbContext db) =>
{
    var exists = await db.Clients.AnyAsync(c => c.Id == id);
    if (!exists) return Results.NotFound();

    var history = await db.Payments
        .Where(p => p.ClientId == id)
        .OrderByDescending(p => p.Timestamp)
        .Select(p => new PaymentDto(
            p.Id, p.ClientId, p.AmountT, p.Timestamp,
            new ClientDto(p.Client!.Id, p.Client.Name, p.Client.Email, p.Client.BalanceT)
        ))
        .ToListAsync();

    return Results.Ok(history);
}).RequireAuthorization();



app.MapGet("/rate", async (AppDbContext db) =>
    await db.Rates.OrderByDescending(r => r.UpdatedAt).FirstAsync()
).RequireAuthorization();

app.MapPost("/rate", async (Rate newRate, AppDbContext db) =>
{
    newRate.UpdatedAt = DateTime.UtcNow;
    db.Rates.Add(newRate);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.Run("http://0.0.0.0:5000");

record LoginRequest(string Email, string Pwd);
record ClientDto(int Id, string Name, string Email, decimal BalanceT);
record ClientUpsertDto(string Name, string Email, decimal BalanceT);
record PaymentDto(int Id, int ClientId, decimal AmountT, DateTime Timestamp, ClientDto Client);
record PaymentIdDto(int Id);
record ClientWithPaymentsDto(int Id,string Name,string Email,decimal BalanceT,List<PaymentIdDto> Payments);
