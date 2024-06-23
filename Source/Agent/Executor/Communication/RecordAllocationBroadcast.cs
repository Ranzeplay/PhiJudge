using Supabase.Realtime.Models;
using System.Text.Json.Serialization;

namespace PhiJudge.Agent.Executor.Communication
{
    internal class RecordAllocationBroadcast : BaseBroadcast
    {
        public static string ChannelName = "phijudge.record.alloc";

        [JsonPropertyName("recordId")]
        public long RecordId { get; set; }

        [JsonPropertyName("agentId")]
        public string AgentId { get; set; } = Guid.Empty.ToString();
    }
}
