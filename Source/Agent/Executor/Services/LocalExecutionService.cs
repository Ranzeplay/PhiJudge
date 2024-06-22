using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;

namespace PhiJudge.Agent.Executor.Services
{
    internal class LocalExecutionService : IExecutionService, IDisposable
    {
        private readonly IDataExchangeService _dataExchangeService;
        private readonly PluginService _pluginService;
        private readonly ILogger<LocalExecutionService> _logger;
        private readonly string TempDirectoryPath = Directory.CreateTempSubdirectory("PhiJudge").FullName;

        public LocalExecutionService(IDataExchangeService dataExchangeService, PluginService pluginService, ILogger<LocalExecutionService> logger)
        {
            _dataExchangeService = dataExchangeService;
            _pluginService = pluginService;
            _logger = logger;

            _dataExchangeService.AddRecordAllocationHandler(RecordAllocationHandler);
        }

        private async void RecordAllocationHandler(object? sender, long e)
        {
            await RunAsync(e);
        }

        public void Dispose()
        {
            _logger.LogInformation("Deleting temporary directory");
            Directory.Delete(TempDirectoryPath, true);
        }

        public async Task RunAsync(long recordId)
        {
            var recordData = await _dataExchangeService.FetchRecordAsync(recordId);
            var problemData = await _dataExchangeService.FetchProblemAsync(recordData.ProblemId);
            var plugin = _pluginService.GetPlugin(recordData.Language);
            _logger.LogInformation("Using plugin {0} to run tests", plugin.PluginEntrypoint.Id);

            var compilationResult = await CompileAsync(plugin, recordData);
            await _dataExchangeService.PushCompilationResultAsync(recordId, compilationResult);

            if (compilationResult.Type != CompilationResultType.FailedWithErrors && compilationResult.Type != CompilationResultType.Unknown)
            {
                _logger.LogInformation("Successfully compiled source code of record {0}", recordData.RecordId);
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

            _logger.LogInformation("Successfully finished test for record {0}", recordId);
        }

        public async Task<ExecutionResult> ExecuteSingle(Plugin plugin, long recordId, TestPointData data)
        {
            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordId.ToString()));
            return await plugin.ExecutionStage.ExecuteAsync(workingDirectory.FullName, data);
        }
    }
}
