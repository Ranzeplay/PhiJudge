namespace PhiJudge.Agent.API.Plugin.Stages
{
    public class CompilationResult
    {
        public long RecordId { get; set; }
        public CompilationResultType Type { get; }
        public string Output { get; }

        public CompilationResult(CompilationResultType type, string output)
        {
            RecordId = -1;
            Type = type;
            Output = output;
        }
    }
}
