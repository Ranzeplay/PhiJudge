using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Plugin.Language.C
{
    internal class ExecutionStage : IExecutionStage
    {
        public Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint)
        {
            throw new NotImplementedException();
        }
    }
}
