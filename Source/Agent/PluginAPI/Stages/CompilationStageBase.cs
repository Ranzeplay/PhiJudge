using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Enums;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// Represents a base class for compilation stages.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    public abstract class CompilationStageBase(ILogger logger) : IEnvironmentRestricted
    {
        /// <summary>
        /// Gets the logger instance.
        /// </summary>
        public ILogger Logger { get; } = logger;

        /// <summary>
        /// Gets the environment type.
        /// </summary>
        public abstract EnvironmentType EnvironmentType { get; }

        /// <summary>
        /// Compiles the source code asynchronously.
        /// </summary>
        /// <param name="directoryPath">The directory path.</param>
        /// <param name="sourceCode">The source code of a record.</param>
        /// <param name="enableOptimization">A flag indicating whether to enable optimization (if supported).</param>
        /// <param name="warningAsError">A flag indicating whether to treat warnings as errors (if supported).</param>
        /// <returns>The compilation result.</returns>
        public abstract Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError);
    }
}
