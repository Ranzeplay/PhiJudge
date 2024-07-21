using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.Executor
{
    internal record Plugin(IPluginEntrypoint PluginEntrypoint, IEnumerable<CompilationStageBase> CompilationStage, IEnumerable<ExecutionStageBase> ExecutionStage);
}
