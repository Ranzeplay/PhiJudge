using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.API.Plugin
{
    public record RecordData(long RecordId, string SourceCode, string Language, long ProblemId, bool EnableOptimization, bool WarningAsError);
}
