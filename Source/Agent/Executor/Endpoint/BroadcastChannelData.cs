using Newtonsoft.Json;
using Supabase.Realtime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Endpoint
{
    internal class BroadcastChannelData : BaseBroadcast
    {
        [JsonProperty("recordId")]
        public long RecordId { get; set; }

        [JsonProperty("agentId")]
        public long AgentId { get; set; }
    }
}
