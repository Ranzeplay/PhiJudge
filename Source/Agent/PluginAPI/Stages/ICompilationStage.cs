namespace PhiJudge.Agent.API.Plugin.Stages
{
    public interface ICompilationStage
    {
        Task<CompilationResult> CompileAsync(string directoryPath, bool enableOptimization, bool warningAsError);
    }
}
