using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using PhiJudge.Agent.Executor.Endpoint.Services;
using Microsoft.Extensions.Logging;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<PluginService>();
builder.Services.AddSingleton<IDataExchangeService, DataExchangeService>();
builder.Services.AddSingleton<IExecutionService, LocalExecutionService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

await builder.Build().RunAsync();
