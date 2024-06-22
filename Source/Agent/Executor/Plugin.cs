using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor
{
    internal record Plugin(IPluginEntrypoint PluginEntrypoint, ICompilationStage CompilationStage, IExecutionStage ExecutionStage);
}
