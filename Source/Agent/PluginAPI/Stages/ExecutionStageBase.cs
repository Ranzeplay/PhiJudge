using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Enums;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// Represents the base class for execution stages in the plugin API.
    /// </summary>
    /// <remarks>
    /// This class provides common functionality and properties for execution stages.
    /// </remarks>
    public abstract class ExecutionStageBase(ILogger logger) : IEnvironmentRestricted
    {
        public readonly ILogger _logger = logger;

        /// <summary>
        /// Gets or sets the execution report mode for the stage.
        /// </summary>
        public virtual ExecutionReportMode ReportMode { get; }

        /// <summary>
        /// Gets the environment type for the stage.
        /// </summary>
        public abstract EnvironmentType EnvironmentType { get; }

        /// <summary>
        /// Executes the stage asynchronously.
        /// </summary>
        /// <param name="workingDirectory">The working directory for the execution.</param>
        /// <param name="recordId">The record ID for the execution.</param>
        /// <param name="testPoints">The test points for the execution.</param>
        /// <returns>A task representing the asynchronous execution.</returns>
        public abstract Task<IEnumerable<ExecutionResult>> ExecuteAsync(string workingDirectory, long recordId, IEnumerable<TestPointData> testPoints);
    }
}
