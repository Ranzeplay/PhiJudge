using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.Executor.Services
{
    internal interface IExecutionService
    {
        Task<CompilationResult> CompileAsync(Plugin plugin, RecordData recordData);
        Task ExecuteAllAsync(Plugin plugin, long recordId, ProblemData data);
        Task RunAsync(long recordId);
    }
}
