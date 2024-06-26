using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.C
{
    internal class CompilationStage : ICompilationStage
    {
        // TODO: Use gcc-output-parser to format compiler output on source code
        public async Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError)
        {
            var sourceFileName = Path.Combine(directoryPath, "source.c");
            var targetFileName = Path.Combine(directoryPath, "target.out");
            File.CreateText(sourceFileName).Close();
            File.WriteAllText(sourceFileName, sourceCode);

            var compilerProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "gcc",
                    Arguments = $"-o \"{targetFileName}\" -x c \"{sourceFileName}\"",
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

            var resultType = CompilationResultType.Unknown;
            if (compilerProcess.ExitCode == 0 && string.IsNullOrWhiteSpace(output))
            {
                resultType = CompilationResultType.PassedWithoutWarnings;
            }
            else if (compilerProcess.ExitCode == 0 && string.IsNullOrWhiteSpace(output))
            {
                resultType = CompilationResultType.PassedWithWarnings;
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
    }
}
