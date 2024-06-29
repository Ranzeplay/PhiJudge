using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public class ExecutionResult
    {
        [JsonPropertyName("recordId")]
        public long RecordId { get; set; }

        [JsonPropertyName("order")]
        public long Order { get; set; }

        [JsonPropertyName("type")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ExecutionResultType Type { get; }

        [JsonPropertyName("output")]
        public string Output { get; }

        [JsonPropertyName("timeMilliseconds")]
        public long TimeMilliseconds { get; }

        [JsonPropertyName("peakMemoryBytes")]
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
