namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// The result type of the compilation stage.
    /// </summary>
    public enum CompilationResultType
    {
        PassedWithoutWarnings,
        PassedWithWarnings,
        FailedWithErrors,
        Unknown
    }
}
