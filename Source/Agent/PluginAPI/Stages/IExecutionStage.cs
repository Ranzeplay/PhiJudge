using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// The implementation will be invoked when running the compiled source code with specific test data.
    /// </summary>
    public interface IExecutionStage
    {
        public event EventHandler<SingleExecutionResultEvent> SingleExecutionReport;

        /// <summary>
        /// Executes the stage asynchronously.
        /// </summary>
        /// <param name="directory">The path to the directory where the record should be processed in.</param>
        /// <param name="testPoint">The test point data.</param>
        /// <returns>The execution result.</returns>
        Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint);

        /// <summary>
        /// Sets the logger for the stage.
        /// </summary>
        /// <param name="logger">The logger instance.</param>
        void SetLogger(ILogger logger);
    }
}
