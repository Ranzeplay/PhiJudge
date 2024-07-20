using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.API.Plugin
{
    public class SingleExecutionResultEvent(long recordId, long order, ExecutionResultType type, long timeMilliseconds, long peakMemoryBytes) : EventArgs
    {
        public long RecordId { get; } = recordId;
        public long Order { get; } = order;
        public ExecutionResultType Type { get; } = type;
        public long TimeMilliseconds { get; } = timeMilliseconds;
        public long PeakMemoryBytes { get; } = peakMemoryBytes;

        public static explicit operator ExecutionResult(SingleExecutionResultEvent executionResultEvent)
        {
            var result = new ExecutionResult(executionResultEvent.Type, "lang.c ignored", executionResultEvent.TimeMilliseconds, executionResultEvent.PeakMemoryBytes);
            result.RecordId = executionResultEvent.RecordId;
            result.Order = executionResultEvent.Order;
            return result;
        }
    }
}
