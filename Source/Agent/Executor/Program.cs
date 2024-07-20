using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PhiJudge.Agent.Executor.Services;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<PluginService>();
builder.Services.AddSingleton<IDataExchangeService, DataExchangeService>();
builder.Services.AddSingleton<IExecutionService, LocalExecutionService>();
builder.Services.AddSingleton<IHeartbeatService, HeartbeatService>();

// Enable console input if the environment variable is set
if (Environment.GetEnvironmentVariable("ENABLE_CONSOLE_INPUT")?.ToLower() == "true")
{
    builder.Services.AddHostedService<ConsoleService>();
}

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var host = builder.Build();

var logger = host.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("PhiJudge Agent Executor started");

host.Services.GetRequiredService<PluginService>();

var dataExchangeService = host.Services.GetRequiredService<IDataExchangeService>();
await dataExchangeService.InitializeAsync();

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

await host.StartAsync();

await host.WaitForShutdownAsync();
