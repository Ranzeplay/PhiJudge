using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Attributes;
using PhiJudge.Agent.API.Plugin.Enums;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
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
        private readonly ObservableCollection<long> TestQueue;

        public LocalExecutionService(IDataExchangeService dataExchangeService, PluginService pluginService, ILogger<LocalExecutionService> logger)
        {
            _dataExchangeService = dataExchangeService;
            _pluginService = pluginService;
            _logger = logger;
            TestQueue = [];
            isInContainer = Environment.GetEnvironmentVariable("RUNTIME")?.ToLower() == "container";

            TestQueue.CollectionChanged += TestQueue_CollectionChanged;

            _dataExchangeService.AddRecordAllocationHandler(RecordAllocationHandler);
        }

        private async void TestQueue_CollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == NotifyCollectionChangedAction.Remove)
            {
                if (e.NewItems?.Count > 0)
                {
                    _logger.LogInformation("There are tests running currently, inserted to queue");
                    await RunAsync((long)e.NewItems[0]!);
                }
            }
            else if (e.Action == NotifyCollectionChangedAction.Add)
            {
                if (e.NewItems?.Count == 1)
                {
                    _logger.LogInformation("Queue is empty, running tests for record {0} immediately", e.NewItems[0]!);
                    await RunAsync((long)e.NewItems[0]!);
                }
            }
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

            TestQueue.Remove(recordId);
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
            await _dataExchangeService.BeginExecutionAsync(recordId);

            var workingDirectory = Directory.CreateDirectory(Path.Combine(TempDirectoryPath, recordId.ToString())).FullName;
            var executionStage = plugin.ExecutionStage.First(x => MatchStageToEnvironment(x));

            if (executionStage is SingleExecutionStageBase single)
            {
                single.OnTestPointFinishAsync = async (result) =>
                {
                    await _dataExchangeService.PushExecutionResultAsync(recordId, (ExecutionResult)result);
                };

                var tasks = new List<Task<ExecutionResult>>();
                foreach (var testPoint in data.TestPoints)
                {
                    var task = single.ExecuteSingleAsync(workingDirectory, recordId, testPoint);
                    tasks.Add(task);
                }
                Task.WaitAll(tasks.ToArray());
            }
            else if (executionStage is BatchExecutionStageBase batch)
            {
                if (batch.ReportMode == ExecutionReportMode.AfterEach)
                {
                    batch.OnTestPointFinishAsync = async (result) =>
                    {
                        await _dataExchangeService.PushExecutionResultAsync(recordId, (ExecutionResult)result);
                    };
                }

                var result = await batch.ExecuteAsync(workingDirectory, recordId, data.TestPoints);

                if(batch.ReportMode == ExecutionReportMode.AfterAll)
                {
                    foreach (var testPoint in result)
                    {
                        await _dataExchangeService.PushExecutionResultAsync(recordId, testPoint);
                    }
                }
            }

            // await _dataExchangeService.FinishExecutionAsync(recordId);
            _logger.LogInformation("Successfully finished test for record {0}", recordId);
        }

        private async void BatchExecutionOnSingleExecutionReport(object? sender, SingleExecutionResultEvent e)
        {
            _logger.LogInformation("Uploading results for record {0}+{1} in a batch execution", e.RecordId, e.Order);
            var result = new ExecutionResult(e.Type, "lang.c ignored", e.TimeMilliseconds, e.PeakMemoryBytes);
            result.RecordId = e.RecordId;
            result.Order = e.Order;
            await _dataExchangeService.PushExecutionResultAsync(e.RecordId, result);
        }

        private void RecordAllocationHandler(object? sender, long e)
        {
            _logger.LogInformation("Received record allocation event for record {0}, inserting to test queue", e);
            TestQueue.Add(e);
        }

        private bool MatchStageToEnvironment<T>(T x) where T : IEnvironmentRestricted
        {
            return x.EnvironmentType == EnvironmentType.Container
                ? isInContainer
                : !isInContainer;
        }

        public void Dispose()
        {
            _logger.LogInformation("Deleting temporary directory");
            Directory.Delete(TempDirectoryPath, true);
        }
    }
}
