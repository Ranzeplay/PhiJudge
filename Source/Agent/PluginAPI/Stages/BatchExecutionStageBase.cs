using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    /// <summary>
    /// Provides the base class for the execution stage to run all test points at once.
    /// </summary>
    /// <param name="logger">The logger of the class</param>
    public abstract class BatchExecutionStageBase(ILogger logger) : ExecutionStageBase(logger)
    {
        /// <summary>
        /// The function to be called when a single test point finished its test.
        /// </summary>
        public Func<SingleExecutionResultEvent, Task> OnTestPointFinishAsync { get; set; } = null!;
    }
}
