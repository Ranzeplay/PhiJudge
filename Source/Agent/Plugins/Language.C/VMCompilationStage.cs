using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Attributes;
using PhiJudge.Agent.API.Plugin.Enums;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.C
{
    internal class VMCompilationStage(ILogger logger) : CompilationStageBase(logger)
    {
        public override EnvironmentType EnvironmentType => EnvironmentType.Host;

        public override Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError)
        {
            File.AppendAllText(Path.Combine(directoryPath, "source.c"), sourceCode);

            Logger.LogInformation("Compiling source code in {0}", directoryPath);
            var process = new Process
            {
                StartInfo = new()
                {
                    FileName = "podman",
                    Arguments = $"run --rm -v {directoryPath}:/working:Z --network=none localhost/phi-plugin-c-compilation:latest",
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
            var output = $"stdout: {process.StandardOutput.ReadToEnd()}\nstderr: {process.StandardError.ReadToEnd()}";

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
    }
}
