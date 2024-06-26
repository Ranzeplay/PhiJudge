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
                    FileName = $"{directory}/target.out",
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
            if (targetProcess.PeakWorkingSet64 > testPoint.MemoryLimitBytes)
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
