using PhiJudge.Agent.API.Plugin;
using Supabase.Realtime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Endpoint.Services
{
    internal class SupabaseRealtimeService : IRealtimeService
    {
        public event EventHandler<FetchRecordData> OnRecordDataReceived;
        public Supabase.Client SupabaseClient;
        public Supabase.Realtime.RealtimeChannel RealtimeChannel;
        public Supabase.Realtime.RealtimeBroadcast<BroadcastChannelData> BroadcastChannel;

        public SupabaseRealtimeService(IExecutionService executionService)
        {
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");

            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true,
                AutoRefreshToken = true
            };

            SupabaseClient = new Supabase.Client(url!, key, options);
        }

        public async void Init()
        {
            await SupabaseClient.InitializeAsync();

            RealtimeChannel = SupabaseClient.Realtime.Channel("phijudge.record.broadcast");
            BroadcastChannel = RealtimeChannel.Register<BroadcastChannelData>();
            BroadcastChannel.AddBroadcastEventHandler((sender, baseBroadcast) =>
            {
                var response = BroadcastChannel.Current();
            });

            await RealtimeChannel.Subscribe();
        }

        public void SendRecordData(long recordId, object o)
        {
            var channel = SupabaseClient.Realtime.Channel($"phijudge.record.{recordId}");
            var broadcast = channel.Broadcast<BaseBroadcast>();
            if (broadcast != null)
            {
                broadcast.Send("status", o);
            }
            else
            {
                throw new Exception("Broadcast is null");
            }
        }
    }
}
