namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// The result type of the execution stage, each represents a different program behavior.
    /// </summary>
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
