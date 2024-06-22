namespace PhiJudge.Agent.API.Plugin
{
    public record TestPointData(long order, string Input, string ExpectedOutput, long TimeLimitMilliseconds, long MemoryLimitBytes);
}
