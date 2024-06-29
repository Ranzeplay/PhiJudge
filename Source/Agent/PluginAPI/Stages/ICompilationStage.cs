using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public interface ICompilationStage
    {
        Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError);
        void SetLogger(ILogger logger);
    }
}
