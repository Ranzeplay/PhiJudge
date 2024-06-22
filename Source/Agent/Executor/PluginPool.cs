using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor
{
    internal class PluginPool
    {
        public readonly Dictionary<string, Plugin> Plugins = [];

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

                if (types.First(t => t.GetInterface(nameof(IPluginEntrypoint)) is not null) is IPluginEntrypoint entrypoint &&
                    types.First(t => t.GetInterface(nameof(ICompilationStage)) is not null) is ICompilationStage compilationStage &&
                    types.First(t => t.GetInterface(nameof(IExecutionStage)) is not null) is IExecutionStage executionStage)
                {
                    Plugins.Add(entrypoint.Id, new Plugin(entrypoint, compilationStage, executionStage));
                }
            }
        }

        public void LoadPlugins()
        {
            foreach (var plugin in Plugins.Values)
            {
                plugin.PluginEntrypoint.Load();
            }
        }

        public void UnloadPlugins()
        {
            foreach (var plugin in Plugins.Values)
            {
                plugin.PluginEntrypoint.Unload();
            }
        }
    }
}
