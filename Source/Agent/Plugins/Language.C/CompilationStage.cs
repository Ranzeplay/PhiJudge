using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Plugin.Language.C
{
    internal class CompilationStage : ICompilationStage
    {
        public Task<CompilationResult> CompileAsync(string directoryPath, bool enableOptimization, bool warningAsError)
        {
            throw new NotImplementedException();
        }
    }
}
