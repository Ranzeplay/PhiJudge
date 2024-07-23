using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.API.Plugin
{
    /// <summary>
    /// Represents an event that contains the result of a single execution.
    /// </summary>
    public class SingleExecutionResultEvent : EventArgs
    {
        /// <summary>
        /// Gets the record ID associated with the execution result.
        /// </summary>
        public long RecordId { get; }

        /// <summary>
        /// Gets the order of the execution result.
        /// </summary>
        public long Order { get; }

        /// <summary>
        /// Gets the type of the execution result.
        /// </summary>
        public ExecutionResultType Type { get; }

        /// <summary>
        /// Gets the time taken for the execution in milliseconds.
        /// </summary>
        public long TimeMilliseconds { get; }

        /// <summary>
        /// Gets the peak memory usage during the execution in bytes.
        /// </summary>
        public long PeakMemoryBytes { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SingleExecutionResultEvent"/> class.
        /// </summary>
        /// <param name="recordId">The record ID associated with the execution result.</param>
        /// <param name="order">The order of the execution result.</param>
        /// <param name="type">The type of the execution result.</param>
        /// <param name="timeMilliseconds">The time taken for the execution in milliseconds.</param>
        /// <param name="peakMemoryBytes">The peak memory usage during the execution in bytes.</param>
        public SingleExecutionResultEvent(long recordId, long order, ExecutionResultType type, long timeMilliseconds, long peakMemoryBytes)
        {
            RecordId = recordId;
            Order = order;
            Type = type;
            TimeMilliseconds = timeMilliseconds;
            PeakMemoryBytes = peakMemoryBytes;
        }

        /// <summary>
        /// Explicitly converts a <see cref="SingleExecutionResultEvent"/> to an <see cref="ExecutionResult"/>.
        /// </summary>
        /// <param name="executionResultEvent">The <see cref="SingleExecutionResultEvent"/> to convert.</param>
        /// <returns>An <see cref="ExecutionResult"/> object.</returns>
        public static explicit operator ExecutionResult(SingleExecutionResultEvent executionResultEvent)
        {
            var result = new ExecutionResult(executionResultEvent.Type, "lang.c ignored", executionResultEvent.TimeMilliseconds, executionResultEvent.PeakMemoryBytes);
            result.RecordId = executionResultEvent.RecordId;
            result.Order = executionResultEvent.Order;
            return result;
        }
    }
}
