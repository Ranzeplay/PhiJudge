using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Enums;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public abstract class BatchExecutionStageBase(ILogger logger) : ExecutionStageBase(logger)
    {
        public Func<SingleExecutionResultEvent, Task> OnTestPointFinishAsync { get; set; } = null!;
    }
}
