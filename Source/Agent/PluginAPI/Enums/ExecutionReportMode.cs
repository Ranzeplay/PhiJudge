namespace PhiJudge.Agent.API.Plugin.Enums
{
    /// <summary>
    /// The way to report execution status. After each test point through a unique function or getting from return value after all test points have been performed.
    /// </summary>
    public enum ExecutionReportMode
    {
        AfterEach,
        AfterAll
    }
}
