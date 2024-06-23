using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.Executor.Services
{
    internal interface IDataExchangeService
    {
        void AddRecordAllocationHandler(EventHandler<long> handler);
        Task<ProblemData> FetchProblemAsync(long problemId);
        Task<RecordData> FetchRecordAsync(long recordId);
        Task InitializeAsync();
        Task<bool> PushCompilationResultAsync(long recordId, CompilationResult compilationResult);
        Task<bool> PushExecutionResultAsync(long recordId, ExecutionResult executionResult);
        Task SendHeartbeatSignalAsync();
        void UpdateSupportedLanguagesAsync(IEnumerable<string> languages);
    }
}
