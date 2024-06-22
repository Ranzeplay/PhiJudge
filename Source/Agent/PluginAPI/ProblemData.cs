using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.API.Plugin
{
    public record ProblemData(long Id, IEnumerable<TestPointData> TestPoints);
}
