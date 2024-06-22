using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.API.Plugin
{
    public record TestPointData(long order, string Input, string ExpectedOutput, long TimeLimitMilliseconds, long MemoryLimitBytes);
}
