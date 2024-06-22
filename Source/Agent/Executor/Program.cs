using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PhiJudge.Agent.Executor.Services;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<PluginService>();
builder.Services.AddSingleton<IDataExchangeService, DataExchangeService>();
builder.Services.AddSingleton<IExecutionService, LocalExecutionService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

await builder.Build().RunAsync();
