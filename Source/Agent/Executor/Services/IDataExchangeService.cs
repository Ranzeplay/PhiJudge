using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Services
{
    internal interface IDataExchangeService
    {
        Task<ProblemData> FetchProblemAsync(long problemId);
        Task<RecordData> FetchRecordAsync(long recordId);
        Task InitializeAsync();
        Task<bool> PushCompilationResultAsync(long recordId, CompilationResult compilationResult);
        Task<bool> PushExecutionResultAsync(long recordId, ExecutionResult executionResult);
    }
}
