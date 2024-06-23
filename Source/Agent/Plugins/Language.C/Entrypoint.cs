using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;

namespace PhiJudge.Plugin.Language.C
{
    public class Entrypoint : IPluginEntrypoint
    {
        public string Id => "lang.c";
        public string Name => "Language C";
        public string Description => "C programming language support for PhiJudge";
        public string Author => "Jeb Feng";
        public string Version => "0.1";
        public string[] Dependencies => [];
        public string[] OptionalDependencies => [];
        public string[] SupportedLanguageId => ["c"];

        private ILogger _logger = null!;

        public void Load(ILogger logger)
        {
            _logger = logger;
            _logger.LogInformation("The plugin uses gcc to run code");
        }

        public void Unload()
        {
            _logger.LogInformation("Unloading plugin for C programming language");
        }
    }
}
