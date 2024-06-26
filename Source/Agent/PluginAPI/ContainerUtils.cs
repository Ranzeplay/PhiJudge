using System.Diagnostics;

namespace PhiJudge.Agent.API.Plugin
{
    /// <summary>
    /// ContainerUtils provides utility methods for interacting with the package manager in Alpine Linux container environment.
    /// </summary>
    public static class ContainerUtils
    {
        public static async Task<int> RunProgramAsync(string program, IEnumerable<string> args)
        {
            var process = new Process
            {
                StartInfo = new()
                {
                    FileName = program,
                    Arguments = string.Join(" ", args),
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                }
            };

            process.Start();
            await process.WaitForExitAsync();

            return process.ExitCode;
        }

        public static async Task<int> InstallPackageAsync(IEnumerable<string> packageNames, bool noCache)
        {
            return await RunProgramAsync("apk", ["add", string.Join(' ', packageNames), noCache ? "--no-cache" : ""]);
        }

        public static async Task<bool> CheckPackageInstalled(string packageName)
        {
            return await RunProgramAsync("apk", ["info", packageName]) == 0;
        }
    }
}
