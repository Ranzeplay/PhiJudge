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
            if(!await ContainerUtils.CheckPackageInstalled("gcc"))
            {
                await ContainerUtils.InstallPackageAsync(["gcc"], true);
            }

            if (!await ContainerUtils.CheckPackageInstalled("valgrind"))
            {
                await ContainerUtils.InstallPackageAsync(["valgrind"], true);
            }
        }
    }
}
