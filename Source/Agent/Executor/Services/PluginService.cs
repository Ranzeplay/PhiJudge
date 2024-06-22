using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Services
{
    internal class PluginService
    {
        private readonly PluginPool PluginPool;

        public PluginService()
        {
            PluginPool = new PluginPool();

            PluginPool.InitPlugins();
            PluginPool.LoadPlugins();
        }

        public Plugin GetPlugin(string language)
        {
            return PluginPool.Plugins.FirstOrDefault(p =>
                p.Value
                .PluginEntrypoint
                .SupportedLanguageId
                .ToImmutableList()
                .Contains(language)
            ).Value;
        }
    }
}
