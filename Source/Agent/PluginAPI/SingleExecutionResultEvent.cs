using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.API.Plugin
{
    public class SingleExecutionResultEvent(long order, ExecutionResultType type, long timeMilliseconds, long peakMemoryBytes) : EventArgs
    {
        public long Order { get; } = order;
        public ExecutionResultType Type { get; } = type;
        public long TimeMilliseconds { get; } = timeMilliseconds;
        public long PeakMemoryBytes { get; } = peakMemoryBytes;
    }
}
