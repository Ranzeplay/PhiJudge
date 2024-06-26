using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin
{
    public interface IPluginEntrypoint
    {
        public string Id { get; }
        public string Name { get; }
        public string Description { get; }
        public string Author { get; }
        public string Version { get; }
        public string[] Dependencies { get; }
        public string[] OptionalDependencies { get; }
        public string[] SupportedLanguageId { get; }

        Task Load(ILogger logger);
        Task Unload();
    }
}
