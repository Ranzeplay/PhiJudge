using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.C
{
    internal class ExecutionStage : IExecutionStage
    {
        public async Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint)
        {
            var targetProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "busybox",
                    Arguments = $"-v -o profile.dat {directory}/target.out",
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
            targetProcess.StandardInput.WriteLine(testPoint.Input);
            await targetProcess.WaitForExitAsync();
            stopwatch.Stop();

            string output = await targetProcess.StandardOutput.ReadToEndAsync();

            // Get usage from profile.dat
            var readerProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "sh",
                    Arguments = $"-c \"cat a.profile | grep \\\"Maximum resident set size\\\" | awk '{{print $6}}'\"",
                    WorkingDirectory = directory,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            readerProcess.Start();
            readerProcess.WaitForExit();
            string memoryUsage = (await readerProcess.StandardOutput.ReadToEndAsync()).Split(' ').Last();

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
            if (long.Parse(memoryUsage) > testPoint.MemoryLimitBytes)
            {
                resultType = ExecutionResultType.MemoryLimitExceeded;
            }
            if (targetProcess.ExitCode != 0)
            {
                resultType = ExecutionResultType.RuntimeError;
            }

            return new(resultType, output, stopwatch.ElapsedMilliseconds, targetProcess.PeakWorkingSet64);
        }
    }
}
