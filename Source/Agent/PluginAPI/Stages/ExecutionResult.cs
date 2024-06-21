namespace PhiJudge.Agent.API.Plugin.Stages
{
    public record ExecutionResult(ExecutionResultType Type, string Output, long TimeMilliseconds, long PeakMemoryBytes);
}
