namespace PhiJudge.Agent.API.Plugin.Stages
{
    public enum ExecutionResultType
    {
        Accepted,
        WrongAnswer,
        TimeLimitExceeded,
        MemoryLimitExceeded,
        OutputLimitExceeded,
        RuntimeError,
        Unknown
    }
}
