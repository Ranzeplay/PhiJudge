using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;

namespace PhiJudge.Plugin.Language.Python
{
    public class Entrypoint : IPluginEntrypoint
    {
        public string Id => "lang.python";
        public string Name => "Language Python";
        public string Description => "Python programming language support for PhiJudge";
        public string Author => "Jeb Feng";
        public string Version => "0.1";
        public string[] Dependencies => [];
        public string[] OptionalDependencies => [];
        public string[] SupportedLanguageId => ["python"];

        private ILogger _logger = null!;

        public async Task Load(ILogger logger)
        {
            _logger = logger;

            await PrepareEnvironmentAsync();
        }

        public Task Unload()
        {
            _logger.LogInformation("Unloading plugin for Python programming language");
            return Task.CompletedTask;
        }

        private async Task PrepareEnvironmentAsync()
        {
            foreach (var pkg in new string[] { "python3", "py3-pip" })
            {
                if (!await ContainerUtils.CheckPackageInstalled(pkg))
                {
                    _logger.LogInformation("{0} is not installed yet, installing using apk", pkg);
                    await ContainerUtils.InstallPackageAsync([pkg], true);
                    _logger.LogInformation("Successfully installed required package {0} via apk", pkg);
                }
            }

            // Install python packages
            if (!await ContainerUtils.CheckPackageInstalled("pip"))
            {
                _logger.LogInformation("Package ruff is not installed yet, installing using pip");
                await ContainerUtils.RunProgramAsync("pip", ["install", "--break-system-packages", "ruff"]);
                _logger.LogInformation("Successfully installed required package ruff via pip");
            }
        }
    }
}
