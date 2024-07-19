using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Attributes;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.C
{
    [ExecutionStrategy(ExecutionType.Batch)]
    [ApplicationRunningOn(RunningOnType.VirtualMachine)]
    internal class VMExecutionStage : IExecutionStage
    {
        private ILogger _logger = null!;

        public event EventHandler<SingleExecutionResultEvent>? SingleExecutionReport;

        public Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint)
        {
            throw new NotImplementedException();
        }

        public void SetLogger(ILogger logger)
        {
            _logger = logger;
        }

        public async Task ExecuteAllAsync(string directory, long recordId, IEnumerable<TestPointData> testPoints)
        {
            _logger.LogInformation("Running tests for record {0}", recordId);

            // Prepare data
            foreach (var tp in testPoints.OrderBy(x => x.Order))
            {
                await File.AppendAllTextAsync(Path.Combine(directory, $"{tp}.in"), tp.Input);
                await File.AppendAllTextAsync(Path.Combine(directory, $"{tp}.out"), tp.ExpectedOutput);
                await File.AppendAllTextAsync(Path.Combine(directory, $"{tp}.req"), $"{tp.MemoryLimitBytes} {tp.TimeLimitMilliseconds}");
            }
            _logger.LogInformation("Record {0}, test data written to disk", recordId);

            var process = new Process
            {
                StartInfo = new()
                {
                    FileName = "podman",
                    Arguments = $"run --rm -v {directory}:/app/context:Z --network=none phi-plugin-c-execution",
                    WorkingDirectory = directory,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            process.Start();
            process.OutputDataReceived += (sender, e) =>
            {
                if (e.Data is null) return;
                if (e.Data.StartsWith("[DEBUG]")) return;
                var data = e.Data.Trim().Split(' ');

                var order = long.Parse(data[0]);

                var time = long.Parse(data[1]);
                var memory = long.Parse(data[2]);
                var type = data[3] switch
                {
                    "AC" => ExecutionResultType.Accepted,
                    "WA" => ExecutionResultType.WrongAnswer,
                    "TLE" => ExecutionResultType.TimeLimitExceeded,
                    "MLE" => ExecutionResultType.MemoryLimitExceeded,
                    "RE" => ExecutionResultType.RuntimeError,
                    _ => ExecutionResultType.Unknown
                };

                _logger.LogInformation("Received test result for {0}+{1}", recordId, order);
                SingleExecutionReport?.Invoke(this, new SingleExecutionResultEvent(recordId, order, type, time, memory));
            };

            _ = Task.Factory.StartNew(async () =>
            {
                await Task.Delay((int)testPoints.Sum(x => x.TimeLimitMilliseconds) + 3000);
                if (!process.HasExited)
                {
                    _logger.LogInformation("Record {0} ran out of time, killing process", recordId);
                    process.Kill();
                }
            });

            process.WaitForExit();
            _logger.LogInformation("Record {0} finished testing", recordId);
        }
    }
}
