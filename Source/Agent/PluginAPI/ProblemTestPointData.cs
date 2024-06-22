namespace PhiJudge.Agent.API.Plugin
{
    public record ProblemTestPointData(string Input, string ExpectedOutput, long TimeLimitMilliseconds, long MemoryLimitBytes);
}
