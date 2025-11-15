using Microsoft.EntityFrameworkCore;
using Npgsql;
using TenderFlow.AI.Embedding;
using TenderFlow.AI.Orchestration;
using TenderFlow.AI.Providers;
using TenderFlow.AI.Rag;
using TenderFlow.Data;

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

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapControllers();

app.Run();
