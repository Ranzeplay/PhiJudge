using PhiJudge.Agent.API.Plugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Endpoint.Services
{
    internal interface IRealtimeService
    {
        public event EventHandler<FetchRecordData> OnRecordDataReceived;
    }
}
