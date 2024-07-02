using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// The implementation will be invoked when compiling the source code mentioned in a record.
    /// </summary>
    public interface IExecutionStage
    {
        Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint);
        void SetLogger(ILogger logger);
    }
}
