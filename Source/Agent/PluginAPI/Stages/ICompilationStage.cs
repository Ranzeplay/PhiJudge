namespace PhiJudge.Agent.API.Plugin.Stages
{
    public interface ICompilationStage
    {
        CompilationResult Compile(string filePath);
    }
}
