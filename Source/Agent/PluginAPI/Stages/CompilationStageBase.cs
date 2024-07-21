using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public abstract class CompilationStageBase(ILogger logger) : IEnvironmentRestricted
    {
        public ILogger Logger { get; } = logger;

        public abstract EnvironmentType EnvironmentType { get; }

        public abstract Task<CompilationResult> CompileAsync(string directoryPath, string sourceCode, bool enableOptimization, bool warningAsError);
    }
}
