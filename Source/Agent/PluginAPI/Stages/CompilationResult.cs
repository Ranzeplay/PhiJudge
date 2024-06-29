using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public class CompilationResult
    {
        [JsonPropertyName("recordId")]
        public long RecordId { get; set; }

        [JsonPropertyName("type")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public CompilationResultType Type { get; }

        [JsonPropertyName("output")]
        public string Output { get; }

        public CompilationResult(CompilationResultType type, string output)
        {
            RecordId = -1;
            Type = type;
            Output = output;
        }
    }
}
