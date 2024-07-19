using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Attributes;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.C
{
    [ApplicationRunningOn(RunningOnType.VirtualMachine)]
    internal class VMCompilationStage : ICompilationStage
    {
        private ILogger _logger = null!;

        public Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError)
        {
            File.AppendAllText(Path.Combine(directoryPath, "source.c"), sourceCode);

            _logger.LogInformation($"Compiling source code in {directoryPath}");
            var process = new Process
            {
                StartInfo = new()
                {
                    FileName = "podman",
                    Arguments = $"run --rm -v {directoryPath}:/working:Z --network=none phi-plugin-c-compilaton",
                    WorkingDirectory = directoryPath,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            process.Start();
            process.WaitForExit();
            var output = process.StandardOutput.ReadToEnd();

            var hasOutputFile = File.Exists(Path.Combine(directoryPath, "target.o"));
            if (hasOutputFile)
            {
                if (string.IsNullOrWhiteSpace(output))
                {
                    return Task.FromResult(new CompilationResult(CompilationResultType.PassedWithoutWarnings, output));
                }
                else
                {
                    return Task.FromResult(new CompilationResult(CompilationResultType.PassedWithWarnings, output));
                }
            }
            else
            {
                return Task.FromResult(new CompilationResult(CompilationResultType.FailedWithErrors, output));
            }
        }

        public void SetLogger(ILogger logger)
        {
            _logger = logger;
        }
    }
}
