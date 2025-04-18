﻿using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Enums;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.Cpp
{
    internal class VMExecutionStage(ILogger logger) : BatchExecutionStageBase(logger)
    {
        public override ExecutionReportMode ReportMode => ExecutionReportMode.AfterEach;
        public override EnvironmentType EnvironmentType => EnvironmentType.Host;

        public override async Task<IEnumerable<ExecutionResult>> ExecuteAsync(string directory, long recordId, IEnumerable<TestPointData> testPoints)
        {
            _logger.LogInformation("Running batch tests for record {0}", recordId);

            // Prepare data
            var testDataPath = Path.Combine(directory, "test_data");
            Directory.CreateDirectory(testDataPath);
            foreach (var tp in testPoints.OrderBy(x => x.Order))
            {
                await File.AppendAllTextAsync(Path.Combine(testDataPath, $"{tp.Order}.in"), tp.Input);
                await File.AppendAllTextAsync(Path.Combine(testDataPath, $"{tp.Order}.out"), tp.ExpectedOutput);
                await File.AppendAllTextAsync(Path.Combine(testDataPath, $"{tp.Order}.req"), $"{tp.MemoryLimitBytes} {tp.TimeLimitMilliseconds}");
            }
            _logger.LogInformation("Record {0}, test data written to disk", recordId);

            var results = new List<ExecutionResult>();
            var process = new Process
            {
                StartInfo = new()
                {
                    FileName = "podman",
                    Arguments = $"run --rm -v {directory}:/app/context:Z --network=none localhost/phi-plugin-cpp-execution:latest",
                    WorkingDirectory = directory,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.OutputDataReceived += async (sender, e) =>
            {
                if (string.IsNullOrWhiteSpace(e.Data)) return;
                if (e.Data.StartsWith("[")) return;
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

                _logger.LogInformation("Received test output for {0}+{1}", recordId, e.Data);
                var result = new SingleExecutionResultEvent(recordId, order, type, time, memory);
                await OnTestPointFinishAsync.Invoke(result);

                results.Add((ExecutionResult)result);
            };

            process.ErrorDataReceived += (sender, e) =>
            {
                if (string.IsNullOrWhiteSpace(e.Data)) return;
                _logger.LogError("Error from record {0}: {1}", recordId, e.Data);
            };

            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();

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

            return results;
        }
    }
}
