using Newtonsoft.Json;
using Supabase.Realtime.Models;

namespace PhiJudge.Agent.Executor.Communication
{
    internal class RecordAllocationBroadcast : BaseBroadcast
    {
        public static string ChannelName = "phijudge.record.alloc";

        [JsonProperty("recordId")]
        public long RecordId { get; set; }

        [JsonProperty("agentId")]
        public string? AgentId { get; set; }
    }
}
