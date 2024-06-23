using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PhiJudge.Agent.Executor.Services;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<PluginService>();
builder.Services.AddSingleton<IDataExchangeService, DataExchangeService>();
builder.Services.AddSingleton<IExecutionService, LocalExecutionService>();
builder.Services.AddSingleton<IHeartbeatService, HeartbeatService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var host = builder.Build();
await host.StartAsync();

var logger = host.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("PhiJudge Agent Executor started");

host.Services.GetRequiredService<PluginService>();
host.Services.GetRequiredService<IDataExchangeService>();
host.Services.GetRequiredService<IExecutionService>();

var heartBeatService = host.Services.GetRequiredService<IHeartbeatService>();
heartBeatService.Begin();

logger.LogInformation("Initialized services");

Console.CancelKeyPress += async (sender, e) =>
{
    logger.LogInformation("Shutting down PhiJudge Agent Executor");
    heartBeatService.End();
    await host.StopAsync();
};

await host.WaitForShutdownAsync();
