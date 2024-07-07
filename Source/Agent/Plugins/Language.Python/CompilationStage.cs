using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.Python
{
    internal class CompilationStage : ICompilationStage
    {
        private ILogger _logger = null!;

        // TODO: Use gcc-output-parser to format compiler output on source code
        public async Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError)
        {
            _logger.LogInformation($"Compiling source code in {directoryPath}");

            var sourceFileName = Path.Combine(directoryPath, "source.py");
            File.CreateText(sourceFileName).Close();
            File.WriteAllText(sourceFileName, sourceCode);

            var compilerProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "ruff",
                    Arguments = $"check \"{sourceFileName}\" --ignore E",
                    WorkingDirectory = directoryPath,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            string output = string.Empty;
            compilerProcess.OutputDataReceived += (sender, e) => output += e.Data + "\n";
            compilerProcess.ErrorDataReceived += (sender, e) => output += e.Data + "\n";

            compilerProcess.Start();
            await compilerProcess.WaitForExitAsync();

            _logger.LogInformation("Finished compiling source code in {0}", directoryPath);

            var resultType = CompilationResultType.Unknown;
            if (compilerProcess.ExitCode == 0)
            {
                resultType = CompilationResultType.PassedWithoutWarnings;
            }
            else if (compilerProcess.ExitCode != 0)
            {
                resultType = CompilationResultType.FailedWithErrors;
            }

            if (!string.IsNullOrWhiteSpace(output))
            {
                output += "\n\n";
            }
            output += $"[Process exited with code {compilerProcess.ExitCode}]";

            return new CompilationResult(resultType, output);
        }

        public void SetLogger(ILogger logger) => _logger = logger;
    }
}
