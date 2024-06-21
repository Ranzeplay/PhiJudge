using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using PhiJudge.Agent.Executor.Endpoint;
using PhiJudge.Agent.Executor.Endpoint.Services;
using Microsoft.Extensions.Logging;

var pluginPool = new PluginPool();

pluginPool.InitPlugins();
pluginPool.LoadPlugins();

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<IRealtimeService, SupabaseRealtimeService>();
builder.Services.AddSingleton<IExecutionService, LocalExecutionService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

await builder.Build().RunAsync();
