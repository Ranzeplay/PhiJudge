namespace PhiJudge.Agent.API.Plugin.Stages
{
    public record ExecutionResult(long RecordId, long Order, ExecutionResultType Type, string Output, long TimeMilliseconds, long PeakMemoryBytes);
}
