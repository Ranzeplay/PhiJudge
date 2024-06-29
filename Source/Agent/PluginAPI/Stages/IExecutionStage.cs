using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public interface IExecutionStage
    {
        Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint);
        void SetLogger(ILogger logger);
    }
}
