using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Enums;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public abstract class ExecutionStageBase(ILogger logger) : IEnvironmentRestricted
    {
        public readonly ILogger _logger = logger;

        public virtual ExecutionReportMode ReportMode { get; }
        public abstract EnvironmentType EnvironmentType { get; }

        public abstract Task<IEnumerable<ExecutionResult>> ExecuteAsync(string workingDirectory, long recordId, IEnumerable<TestPointData> testPoints);
    }
}
