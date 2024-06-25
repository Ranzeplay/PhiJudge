using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin
{
    public class ProblemTestPointData(long order, string input, string expectedOutput, long timeLimitMilliseconds, long memoryLimitBytes)
    {
        [JsonPropertyName("order")]
        public long Order { get; set; } = order;

        [JsonPropertyName("input")]
        public string Input { get; set; } = input;

        [JsonPropertyName("expectedOutput")]
        public string ExpectedOutput { get; set; } = expectedOutput;

        [JsonPropertyName("timeLimitMilliseconds")]
        public long TimeLimitMilliseconds { get; set; } = timeLimitMilliseconds;

        [JsonPropertyName("memoryLimitBytes")]
        public long MemoryLimitBytes { get; set; } = memoryLimitBytes;
    }
}
