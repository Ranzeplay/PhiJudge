namespace PhiJudge.Agent.API.Plugin
{
    public record TestPointData(long Order, string Input, string ExpectedOutput, long TimeLimitMilliseconds, long MemoryLimitBytes);
}
