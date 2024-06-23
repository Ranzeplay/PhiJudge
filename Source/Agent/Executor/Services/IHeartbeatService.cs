using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Services
{
    internal interface IHeartbeatService : IDisposable
    {
        public void Begin();
        public void End();
    }
}
