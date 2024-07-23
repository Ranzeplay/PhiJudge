using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// Represents the result of an execution stage.
    /// </summary>
    public class ExecutionResult
    {
        /// <summary>
        /// Gets or sets the record ID.
        /// </summary>
        [JsonPropertyName("recordId")]
        public long RecordId { get; set; }

        /// <summary>
        /// Gets or sets the order.
        /// </summary>
        [JsonPropertyName("order")]
        public long Order { get; set; }

        /// <summary>
        /// Gets the type of the execution result.
        /// </summary>
        [JsonPropertyName("type")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ExecutionResultType Type { get; }

        /// <summary>
        /// Gets the output of the execution.
        /// </summary>
        [JsonPropertyName("output")]
        public string Output { get; }

        /// <summary>
        /// Gets the time taken for the execution in milliseconds.
        /// </summary>
        [JsonPropertyName("timeMilliseconds")]
        public long TimeMilliseconds { get; }

        /// <summary>
        /// Gets the peak memory usage during the execution in bytes.
        /// </summary>
        [JsonPropertyName("peakMemoryBytes")]
        public long PeakMemoryBytes { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ExecutionResult"/> class.
        /// </summary>
        /// <param name="type">The type of the execution result.</param>
        /// <param name="output">The output of the execution.</param>
        /// <param name="timeMilliseconds">The time taken for the execution in milliseconds.</param>
        /// <param name="peakMemoryBytes">The peak memory usage during the execution in bytes.</param>
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
