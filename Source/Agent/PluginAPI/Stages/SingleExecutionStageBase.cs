using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Enums;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public abstract class SingleExecutionStageBase(ILogger logger) : BatchExecutionStageBase(logger)
    {
        public override ExecutionReportMode ReportMode { get => ExecutionReportMode.AfterEach; }

        public override async Task<IEnumerable<ExecutionResult>> ExecuteAsync(string workingDirectory, long recordId, IEnumerable<TestPointData> testPoints)
        {
            var results = new List<ExecutionResult>();
            foreach (var testPoint in testPoints)
            {
                var result = await ExecuteSingleAsync(workingDirectory, recordId, testPoint);
                await OnTestPointFinishAsync(new(recordId, result.Order, result.Type, result.TimeMilliseconds, result.PeakMemoryBytes));
            }

            return results;
        }

        public abstract Task<ExecutionResult> ExecuteSingleAsync(string workingDirectory, long recordId, TestPointData testPoint);
    }
}
