using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Services
{
    internal class LocalExecutionService(IDataExchangeService dataExchangeService, PluginService pluginService) : IExecutionService, IDisposable
    {
        private readonly IDataExchangeService _dataExchangeService = dataExchangeService;
        private readonly PluginService _pluginService = pluginService;
        private readonly string TempDirectoryPath = Directory.CreateTempSubdirectory("PhiJudge").FullName;

        public void Dispose()
        {
            Directory.Delete(TempDirectoryPath, true);
        }

        public async Task RunAsync(long recordId)
        {
            var recordData = await _dataExchangeService.FetchRecordAsync(recordId);
            var problemData = await _dataExchangeService.FetchProblemAsync(recordData.ProblemId);
            var plugin = _pluginService.GetPlugin(recordData.Language);

            var compilationResult = await CompileAsync(plugin, recordData);
            await _dataExchangeService.PushCompilationResultAsync(recordId, compilationResult);

            if (compilationResult.Type != CompilationResultType.FailedWithErrors && compilationResult.Type != CompilationResultType.Unknown)
            {
                await ExecuteAllAsync(plugin, recordId, problemData);
            }
        }

        public async Task<CompilationResult> CompileAsync(Plugin plugin, RecordData recordData)
        {
            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordData.RecordId.ToString()));
            return await plugin.CompilationStage.CompileAsync(workingDirectory.FullName, recordData.EnableOptimization, recordData.WarningAsError);
        }

        public async Task ExecuteAllAsync(Plugin plugin, long recordId, ProblemData data)
        {
            foreach (var testPoint in data.TestPoints)
            {
                var executionResult = await ExecuteSingle(plugin, recordId, testPoint);
                await _dataExchangeService.PushExecutionResultAsync(recordId, executionResult);
            }
        }

        public async Task<ExecutionResult> ExecuteSingle(Plugin plugin, long recordId, TestPointData data)
        {
            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordId.ToString()));
            return await plugin.ExecutionStage.ExecuteAsync(workingDirectory.FullName, data);
        }
    }
}
