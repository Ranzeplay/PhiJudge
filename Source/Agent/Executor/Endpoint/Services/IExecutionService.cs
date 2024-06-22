using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.Executor.Endpoint.Services
{
    internal interface IExecutionService
    {
        Task<CompilationResult> CompileAsync(Plugin plugin, RecordData recordData);
        Task ExecuteAllAsync(Plugin plugin, long recordId, ProblemData data);
        Task<ExecutionResult> ExecuteSingle(Plugin plugin, long recordId, TestPointData data);
        Task RunAsync(long recordId);
    }
}
