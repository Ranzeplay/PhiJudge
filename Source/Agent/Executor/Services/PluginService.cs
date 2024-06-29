using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Collections.Immutable;
using System.Reflection;

namespace PhiJudge.Agent.Executor.Services
{
    internal class PluginService
    {
        private readonly ILogger<PluginService> _logger;
        private readonly IDataExchangeService _dataExchangeService;
        private readonly ILoggerFactory _loggerFactory;

        private readonly string PluginsDirectory;
        private Dictionary<string, Plugin> Plugins { get; } = [];
        private readonly FileSystemWatcher Watcher;

        public PluginService(ILogger<PluginService> logger, IDataExchangeService dataExchangeService, ILoggerFactory loggerFactory)
        {
            PluginsDirectory = Environment.GetEnvironmentVariable("PLUGINS_DIR") ?? Path.Combine(Environment.CurrentDirectory, "plugins");
            if (!Directory.Exists(PluginsDirectory))
            {
                Directory.CreateDirectory(PluginsDirectory);
            }
            Watcher = new FileSystemWatcher(PluginsDirectory);

            _logger = logger;
            _dataExchangeService = dataExchangeService;
            _loggerFactory = loggerFactory;

            InitPlugins();
            LoadPlugins();

            RegisterFileWatcher();
        }

        public Plugin GetPlugin(string language)
        {
            return Plugins.FirstOrDefault(p =>
                p.Value
                .PluginEntrypoint
                .SupportedLanguageId
                .ToImmutableList()
                .Contains(language)
            ).Value;
        }

        public void InitPlugins()
        {
            foreach (var file in Directory.GetFiles(PluginsDirectory, "*.dll"))
            {
                var assembly = Assembly.LoadFile(file);
                var types = assembly.GetTypes();

                var entrypoint = types.FirstOrDefault(t => t.GetInterface(nameof(IPluginEntrypoint)) is not null)!.GetConstructors().First().Invoke([]) as IPluginEntrypoint;
                var compilationStage = types.FirstOrDefault(t => t.GetInterface(nameof(ICompilationStage)) is not null)!.GetConstructors().First().Invoke([]) as ICompilationStage;
                var executionStage = types.FirstOrDefault(t => t.GetInterface(nameof(IExecutionStage)) is not null)!.GetConstructors().First().Invoke([]) as IExecutionStage;

                Plugins.Add(entrypoint!.Id, new Plugin(entrypoint!, compilationStage!, executionStage!));
                _logger.LogInformation("Loaded plugin {0}, whose id is {1}", entrypoint.Name, entrypoint.Id);
            }
            _logger.LogInformation("Found {0} plugins", Plugins.Count);

            _dataExchangeService.UpdateSupportedLanguagesAsync(Plugins.Values.SelectMany(p => p.PluginEntrypoint.SupportedLanguageId).Distinct());
        }

        public void LoadPlugins()
        {
            foreach (var plugin in Plugins.Values)
            {
                var pluginLogger = _loggerFactory.CreateLogger(plugin.PluginEntrypoint.Id);

                plugin.PluginEntrypoint.Load(pluginLogger);
            }

            _logger.LogInformation("Loaded {0} plugins", Plugins.Count);
        }

        public void UnloadPlugins()
        {
            foreach (var plugin in Plugins.Values)
            {
                plugin.PluginEntrypoint.Unload();
            }

            Plugins.Clear();

            _logger.LogInformation("Unloaded {0} plugins", Plugins.Count);
        }

        private void RegisterFileWatcher()
        {
            Watcher.NotifyFilter = NotifyFilters.FileName | NotifyFilters.DirectoryName | NotifyFilters.LastWrite | NotifyFilters.CreationTime;
            Watcher.EnableRaisingEvents = true;
            Watcher.Renamed += ReloadPlugins;
            Watcher.Created += ReloadPlugins;
            Watcher.Changed += ReloadPlugins;
        }

        private void ReloadPlugins(object _s, FileSystemEventArgs _e)
        {
            UnloadPlugins();
            InitPlugins();
            LoadPlugins();
            _logger.LogInformation($"Reloaded plugins due to the change of plugins directory");
        }
    }
}
