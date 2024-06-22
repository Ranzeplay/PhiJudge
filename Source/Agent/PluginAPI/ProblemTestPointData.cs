namespace PhiJudge.Agent.API.Plugin
{
    public record ProblemTestPointData(long Order, string Input, string ExpectedOutput, long TimeLimitMilliseconds, long MemoryLimitBytes);
}
