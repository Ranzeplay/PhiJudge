using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin
{
    /// <summary>
    /// When initializing plugins, Executor will read this class and get necessary data.
    /// When loading and unloading the plugin, there are also methods to invoke.
    /// </summary>
    public interface IPluginEntrypoint
    {
        /// <summary>
        /// The unique identifier of the plugin.
        /// </summary>
        public string Id { get; }
        /// <summary>
        /// The name of the plugin.
        /// </summary>
        public string Name { get; }
        /// <summary>
        /// The description of the plugin.
        /// </summary>
        public string Description { get; }
        /// <summary>
        /// The author of the plugin.
        /// </summary>
        public string Author { get; }
        /// <summary>
        /// The version of the plugin.
        /// </summary>
        public string Version { get; }
        /// <summary>
        /// The required dependencies of the plugin. They will be loaded before this plugin loads.
        /// </summary>
        public string[] Dependencies { get; }
        /// <summary>
        /// The optional dependencies of the plugin.
        /// </summary>
        public string[] OptionalDependencies { get; }
        /// <summary>
        /// The supported language IDs of the plugin.
        /// </summary>
        public string[] SupportedLanguageId { get; }

        /// <summary>
        /// Invoked when Executor want's to load the plugin.
        /// </summary>
        /// <param name="logger">A logger for plugin to log something to output.</param>
        /// <returns>Complete the task</returns>
        Task Load(ILogger logger);
        /// <summary>
        /// Invoked when executor want's to unload the plugin.
        /// </summary>
        /// <returns>Complete the task</returns>
        Task Unload();
    }
}
