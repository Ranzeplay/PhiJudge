using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Plugin.Language.C
{
    internal class ExecutionStage : IExecutionStage
    {
        public Task<ExecutionResult> ExecuteAsync(string directory, TestPointData testPoint)
        {
            throw new NotImplementedException();
        }
    }
}
