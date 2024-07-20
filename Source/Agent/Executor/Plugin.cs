using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.Executor
{
    internal record Plugin(IPluginEntrypoint PluginEntrypoint, IEnumerable<ICompilationStage> CompilationStage, IEnumerable<ExecutionStageBase> ExecutionStage);
}
