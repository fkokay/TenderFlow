using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;
using TenderFlow.AI.Embedding;
using TenderFlow.AI.Orchestration;
using TenderFlow.AI.Providers;
using TenderFlow.AI.Rag;
using TenderFlow.Data;
using TenderFlow.Helpers;
using TenderFlow.Jobs;
using TenderFlow.Services;
using QuartzHostedService = TenderFlow.Services.QuartzHostedService;

var builder = WebApplication.CreateBuilder(args);

NpgsqlConnection.GlobalTypeMapper.UseVector();


//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.AddControllersWithViews().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});

builder.Services.AddDbContext<TenderFlowContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
.AddCookie(options =>
{
    options.Cookie.Name = "TenderFlowAuthentication";
    options.CookieManager = new ChunkingCookieManager();
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.LoginPath = "/Identity/Login";
    options.LogoutPath = "/Identity/Logout";
    options.AccessDeniedPath = "/Home/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
    options.Cookie.MaxAge = options.ExpireTimeSpan;
});
builder.Services.AddAuthorization();

builder.Services.AddHttpClient("Gemini");
builder.Services.AddHttpClient("OpenAI");
builder.Services.AddScoped<IRagService, RagService>();
builder.Services.AddScoped<PgVectorRagService>();

builder.Services.AddScoped<IAiEmbeddingProvider, GeminiEmbeddingProvider>();
builder.Services.AddScoped<IAiEmbeddingProvider, OpenAiEmbeddingProvider>();
builder.Services.AddScoped<IEmbeddingSelector, EmbeddingSelector>();

builder.Services.AddScoped<IAiProvider, OpenAiProvider>();
builder.Services.AddScoped<IAiProvider, GeminiProvider>();
builder.Services.AddScoped<IAiOrchestrator, AiOrchestrator>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ShipmentJob>();
builder.Services.AddSingleton<IJobFactory, QuartzJobFactory>();
builder.Services.AddSingleton<ISchedulerFactory, StdSchedulerFactory>();
builder.Services.AddHostedService<QuartzHostedService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Swagger middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TENDER FLOW API v1");
    c.RoutePrefix = "swagger"; // URL -> /swagger
});

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapControllers();

app.Run();
