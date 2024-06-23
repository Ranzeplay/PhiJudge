﻿using Microsoft.Extensions.Logging;
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

        private Dictionary<string, Plugin> Plugins { get; } = [];

        public PluginService(ILogger<PluginService> logger, IDataExchangeService dataExchangeService, ILoggerFactory loggerFactory)
        {
            _logger = logger;
            _dataExchangeService = dataExchangeService;
            _loggerFactory = loggerFactory;

            InitPlugins();
            LoadPlugins();
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
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            foreach (var file in Directory.GetFiles(path, "*.dll"))
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

            _logger.LogInformation("Unloaded {0} plugins", Plugins.Count);
        }
    }
}