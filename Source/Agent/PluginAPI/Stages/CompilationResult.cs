using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// The return value of the compilation stage, will be sent to Central server.
    /// </summary>
    public class CompilationResult
    {
        /// <summary>
        /// The ID of the record
        /// </summary>
        [JsonPropertyName("recordId")]
        public long RecordId { get; set; }

        /// <summary>
        /// The comilation result type
        /// </summary>
        [JsonPropertyName("type")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public CompilationResultType Type { get; }

        /// <summary>
        /// The compilation output
        /// </summary>
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
