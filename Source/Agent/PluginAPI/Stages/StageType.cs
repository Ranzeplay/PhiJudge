using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.API.Plugin.Stages
{
    public enum StageType
    {
        Pending,
        Compiling,
        Executing,
        Finished,
        Error,
        Unknown
    }
}
