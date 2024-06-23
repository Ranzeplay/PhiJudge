using PhiJudge.Agent.API.Plugin.Stages;
using System.Diagnostics;

namespace PhiJudge.Plugin.Language.C
{
    internal class CompilationStage : ICompilationStage
    {
        // TODO: Use gcc-output-parser to format compiler output on source code
        public async Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError)
        {
            var file = File.CreateText($"{directoryPath}/source.c");
            await file.WriteAsync(sourceCode);

            var compilerProcess = new Process
            {
                StartInfo = new()
                {
                    FileName = "gcc",
                    Arguments = $"-o {directoryPath}/target.out -x c {directoryPath}/source.c",
                    WorkingDirectory = directoryPath,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            compilerProcess.Start();
            await compilerProcess.WaitForExitAsync();

            string output = await compilerProcess.StandardOutput.ReadToEndAsync();

            var resultType = CompilationResultType.Unknown;
            if (compilerProcess.ExitCode == 0 && !string.IsNullOrWhiteSpace(output))
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
