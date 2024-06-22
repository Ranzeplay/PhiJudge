namespace PhiJudge.Agent.API.Plugin
{
    public record RecordData(long RecordId, string SourceCode, string Language, long ProblemId, bool EnableOptimization, bool WarningAsError);
}
