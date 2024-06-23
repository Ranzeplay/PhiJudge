namespace PhiJudge.Agent.API.Plugin.Stages
{
    public class ExecutionResult
    {
        public long RecordId { get; set; }
        public long Order { get; set; }
        public ExecutionResultType Type { get; }
        public string Output { get; }
        public long TimeMilliseconds { get; }
        public long PeakMemoryBytes { get; }

        public ExecutionResult(ExecutionResultType type, string output, long timeMilliseconds, long peakMemoryBytes)
        {
            RecordId = -1;
            Order = -1;
            Type = type;
            Output = output;
            TimeMilliseconds = timeMilliseconds;
            PeakMemoryBytes = peakMemoryBytes;
        }
    }
}
