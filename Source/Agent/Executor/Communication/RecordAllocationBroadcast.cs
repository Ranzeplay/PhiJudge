using Supabase.Realtime.Models;

namespace PhiJudge.Agent.Executor.Communication
{
    internal class RecordAllocationBroadcast : BaseBroadcast
    {
        public static string ChannelName = "phijudge.record.alloc";

        public long RecordId { get; set; }
        public string AgentId { get; set; } = Guid.Empty.ToString();
    }
}
