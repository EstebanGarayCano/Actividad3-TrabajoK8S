using Microsoft.EntityFrameworkCore;
using Polly;
using Polly.CircuitBreaker;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Backend.Data;
using Backend.DTOs;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Circuit Breaker con Polly para GET /api/Usuarios
// Polly exige MinimumThroughput >= 2. Con 2 fallos al 100% se abre el circuito.
builder.Services.AddSingleton(
    new ResiliencePipelineBuilder<IEnumerable<UsuarioResponseDto>>()
        .AddCircuitBreaker(new CircuitBreakerStrategyOptions<IEnumerable<UsuarioResponseDto>>
        {
            FailureRatio = 1.0,
            MinimumThroughput = 2,
            SamplingDuration = TimeSpan.FromSeconds(30),
            BreakDuration = TimeSpan.FromSeconds(5),
        })
        .Build());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=proyectoesteban.db";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var cs = connectionString.TrimStart();
    if (cs.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
        options.UseSqlite(connectionString);
    else if (IsMySqlConnectionString(connectionString))
        options.UseMySql(connectionString, ServerVersion.Parse("8.0.0"), mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure(maxRetryCount: 1, maxRetryDelay: TimeSpan.FromSeconds(2), errorNumbersToAdd: null);
        });
    else
        options.UseSqlServer(connectionString);
});

static bool IsMySqlConnectionString(string cs)
{
    return cs.Contains("Server=", StringComparison.OrdinalIgnoreCase)
        && (cs.Contains("User=", StringComparison.OrdinalIgnoreCase)
            || cs.Contains("Uid=", StringComparison.OrdinalIgnoreCase)
            || cs.Contains("Password=", StringComparison.OrdinalIgnoreCase))
        && !cs.Contains("Trusted_Connection", StringComparison.OrdinalIgnoreCase);
}

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<NotificacionesHubService>();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Captura cualquier excepción no controlada y devuelve 503 JSON (evita ECONNRESET en Postman)
app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (Exception)
    {
        if (!context.Response.HasStarted)
        {
            context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("{\"codigo\":\"Error\",\"mensaje\":\"Error temporal. Reintente en unos segundos.\"}");
        }
        else
        {
            throw;
        }
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.MapHub<Backend.Hubs.NotificacionesHub>(Backend.Hubs.NotificacionesHub.NombreRuta);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var cs = connectionString.TrimStart();
    if (cs.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
    {
        await db.Database.EnsureCreatedAsync();
        try { _ = await db.Usuarios.AnyAsync(); }
        catch
        {
            await db.Database.EnsureDeletedAsync();
            await db.Database.EnsureCreatedAsync();
        }
    }
    else if (IsMySqlConnectionString(connectionString))
    {
        try
        {
            var created = await db.Database.EnsureCreatedAsync();
            logger.LogInformation("MySQL: Base de datos y tablas listas. Created={Created}", created);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "MySQL: No se pudo conectar al arrancar. La API seguirá en marcha; los endpoints que usen la BD devolverán 503 hasta que el contenedor esté en ejecución.");
            // No relanzamos: la app arranca y GET /api/Usuarios etc. devolverán 503 controlado
        }
    }
    else
    {
        try { await db.Database.MigrateAsync(); }
        catch { await db.Database.EnsureCreatedAsync(); }
    }
}

app.Run();
