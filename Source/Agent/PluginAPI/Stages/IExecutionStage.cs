namespace PhiJudge.Agent.API.Plugin.Stages
{
    public interface IExecutionStage
    {
        Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint);
    }
}
