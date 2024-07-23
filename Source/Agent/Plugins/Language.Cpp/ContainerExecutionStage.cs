using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Enums;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.Cpp
{
    internal class ContainerExecutionStage(ILogger logger) : SingleExecutionStageBase(logger)
    {
        public override EnvironmentType EnvironmentType => EnvironmentType.Container;

        public override async Task<ExecutionResult> ExecuteSingleAsync(string directory, long recordId, TestPointData testPoint)
        {
            _logger.LogInformation("Executing test point {0}+{1} in {2} from compiled target", new DirectoryInfo(directory).Name, testPoint.Order, directory);

            var profileFilePath = Path.Combine(directory, "profile.dat");
            var targetProgramPath = Path.Combine(directory, "target.out");
            var targetProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "/bin/busybox",
                    Arguments = $"time -v -o \"{profileFilePath}\" \"{targetProgramPath}\"",
                    WorkingDirectory = directory,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            Stopwatch stopwatch = new();
            stopwatch.Start();

            targetProcess.Start();

            if (!string.IsNullOrEmpty(testPoint.Input))
            {
                targetProcess.StandardInput.WriteLine(testPoint.Input);
            }

            await targetProcess.WaitForExitAsync();
            stopwatch.Stop();

            string output = await targetProcess.StandardOutput.ReadToEndAsync();

            _logger.LogInformation("Finished executing {0}+{1}, collecting data...", new DirectoryInfo(directory).Name, testPoint.Order);

            // Get usage from profile.dat
            var readerProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "sh",
                    Arguments = $"-c \"cat {profileFilePath} | grep \\\"Maximum resident set size\\\" | awk '{{print $6}}'\"",
                    WorkingDirectory = directory,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            readerProcess.Start();
            readerProcess.WaitForExit();
            string memoryUsageStr = (await readerProcess.StandardOutput.ReadToEndAsync()).Trim().Split(' ').Last();
            long memoryUsageNum = long.Parse(memoryUsageStr);

            var resultType = ExecutionResultType.Unknown;
            if (output.Trim() == testPoint.ExpectedOutput.Trim())
            {
                resultType = ExecutionResultType.Accepted;
            }
            else
            {
                resultType = ExecutionResultType.WrongAnswer;
            }
            if (stopwatch.ElapsedMilliseconds > testPoint.TimeLimitMilliseconds)
            {
                resultType = ExecutionResultType.TimeLimitExceeded;
            }
            if (memoryUsageNum > testPoint.MemoryLimitBytes)
            {
                resultType = ExecutionResultType.MemoryLimitExceeded;
            }
            if (targetProcess.ExitCode != 0)
            {
                resultType = ExecutionResultType.RuntimeError;
            }

            return new(resultType, output, stopwatch.ElapsedMilliseconds, memoryUsageNum);
        }
    }
}
