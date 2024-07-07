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

        public async Task Load(ILogger logger)
        {
            _logger = logger;

            await PrepareEnvironmentAsync();
        }

        public Task Unload()
        {
            _logger.LogInformation("Unloading plugin for C programming language");
            return Task.CompletedTask;
        }

        private async Task PrepareEnvironmentAsync()
        {
            foreach (var pkg in new string[] { "gcc", "busybox", "musl-dev" })
            {
                if (!await ContainerUtils.CheckPackageInstalled(pkg))
                {
                    _logger.LogInformation("{0} is not installed yet, installing using apk", pkg);
                    await ContainerUtils.InstallPackageAsync([pkg], true);
                    _logger.LogInformation("Successfully installed required package {0} via apk", pkg);
                }
            }
        }
    }
}
