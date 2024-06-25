using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin
{
    public class RecordData(long recordId, string sourceCode, string language, long problemId, bool enableOptimization, bool warningAsError)
    {
        [JsonPropertyName("recordId")]
        public long RecordId { get; set; } = recordId;

        [JsonPropertyName("sourceCode")]
        public string SourceCode { get; set; } = sourceCode;

        [JsonPropertyName("language")]
        public string Language { get; set; } = language;

        [JsonPropertyName("problemId")]
        public long ProblemId { get; set; } = problemId;

        [JsonPropertyName("enableOptimization")]
        public bool EnableOptimization { get; set; } = enableOptimization;

        [JsonPropertyName("warningAsError")]
        public bool WarningAsError { get; set; } = warningAsError;
    }
}
