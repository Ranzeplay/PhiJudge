using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Attributes;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Reflection;

namespace PhiJudge.Agent.Executor.Services
{
    internal class LocalExecutionService : IExecutionService, IDisposable
    {
        private readonly IDataExchangeService _dataExchangeService;
        private readonly PluginService _pluginService;
        private readonly ILogger<LocalExecutionService> _logger;
        private readonly string TempDirectoryPath = Directory.CreateTempSubdirectory("PhiJudge").FullName;
        private readonly bool isInContainer;

        public LocalExecutionService(IDataExchangeService dataExchangeService, PluginService pluginService, ILogger<LocalExecutionService> logger)
        {
            _dataExchangeService = dataExchangeService;
            _pluginService = pluginService;
            _logger = logger;
            isInContainer = Environment.GetEnvironmentVariable("RUNTIME")?.ToLower() == "container";

            _dataExchangeService.AddRecordAllocationHandler(RecordAllocationHandler);
        }

        public async Task RunAsync(long recordId)
        {
            var recordData = await _dataExchangeService.FetchRecordAsync(recordId);
            var problemData = await _dataExchangeService.FetchProblemAsync(recordData.ProblemId);
            var plugin = _pluginService.GetPlugin(recordData.Language);
            _logger.LogInformation("Using plugin {0} to run tests", plugin.PluginEntrypoint.Id);

            var compilationResult = await CompileAsync(plugin, recordData);
            compilationResult.RecordId = recordId;
            await _dataExchangeService.PushCompilationResultAsync(recordId, compilationResult);

            if (compilationResult.Type != CompilationResultType.FailedWithErrors && compilationResult.Type != CompilationResultType.Unknown)
            {
                _logger.LogInformation("Successfully compiled source code of record {0}", recordData.RecordId);
                await ExecuteAllAsync(plugin, recordId, problemData);
            }
            else
            {
                _logger.LogInformation("Failed to compile source code of record {0}", recordData.RecordId);
            }
        }

        public async Task<CompilationResult> CompileAsync(Plugin plugin, RecordData recordData)
        {
            await _dataExchangeService.BeginCompilationAsync(recordData.RecordId);
            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordData.RecordId.ToString()));
            return await plugin.CompilationStage
                .First(x => MatchStageToEnvironment(x))
                .CompileAsync(workingDirectory.FullName, recordData.SourceCode, recordData.EnableOptimization, recordData.WarningAsError);
        }

        public async Task ExecuteAllAsync(Plugin plugin, long recordId, ProblemData data)
        {
            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordId.ToString()));
            var strategyAttr = plugin.ExecutionStage.First(x => MatchStageToEnvironment(x))
                .GetType()
                .GetCustomAttributes(true)
                .FirstOrDefault(x => x.GetType() == typeof(ExecutionStrategy));
            if (strategyAttr != null)
            {
                if (((ExecutionStrategy)strategyAttr).Type == ExecutionType.Batch)
                {
                    var instance = plugin.ExecutionStage.First(x => MatchStageToEnvironment(x));
                    instance.SingleExecutionReport += BatchExecutionOnSingleExecutionReport;
                    await instance.ExecuteAllAsync(workingDirectory.FullName, recordId, data.TestPoints);
                    instance.SingleExecutionReport -= BatchExecutionOnSingleExecutionReport;
                }

                else
                {
                    await _dataExchangeService.BeginExecutionAsync(recordId);
                    foreach (var testPoint in data.TestPoints)
                    {
                        var executionResult = await ExecuteSingleAsync(plugin, recordId, testPoint);
                        await _dataExchangeService.PushExecutionResultAsync(recordId, executionResult);
                    }

                }

                await _dataExchangeService.FinishExecutionAsync(recordId);
            }
            else
            {
                throw new NotImplementedException("Execution strategy not found");
            }

            _logger.LogInformation("Successfully finished test for record {0}", recordId);
        }

        private async void BatchExecutionOnSingleExecutionReport(object? sender, SingleExecutionResultEvent e)
        {
            await _dataExchangeService.PushExecutionResultAsync(e.RecordId, new(e.Type, "lang.c ignored", e.TimeMilliseconds, e.PeakMemoryBytes));
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

        public async Task<ExecutionResult> ExecuteSingleAsync(Plugin plugin, long recordId, TestPointData data)
        {
            _logger.LogInformation("Executing test point {0} for record {1}", data.Order, recordId);

            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordId.ToString()));
            var result = await plugin.ExecutionStage
                .First(x => MatchStageToEnvironment(x))
                .ExecuteAsync(workingDirectory.FullName, data);
            result.RecordId = recordId;
            result.Order = data.Order;
            return result;
        }

        private bool MatchStageToEnvironment<T>(T x)
        {
            return (x?.GetType().GetCustomAttribute<ApplicationRunningOn>()?.RunningOnType) != RunningOnType.VirtualMachine
                ? isInContainer
                : !isInContainer;
        }
    }
}
