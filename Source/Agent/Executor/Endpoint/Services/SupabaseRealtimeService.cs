using PhiJudge.Agent.API.Plugin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Endpoint.Services
{
    internal class SupabaseRealtimeService : IRealtimeService
    {
        public event EventHandler<RecordData> OnRecordDataReceived;
    }
}
