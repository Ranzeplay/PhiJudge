using Microsoft.Extensions.Hosting;
using PhiJudge.Agent.Executor.Endpoint;

var pluginPool = new PluginPool();

pluginPool.InitPlugins();
pluginPool.LoadPlugins();

var builder = Host.CreateApplicationBuilder(args);

await builder.Build().RunAsync();
