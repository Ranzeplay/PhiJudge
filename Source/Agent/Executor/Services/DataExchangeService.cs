using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using PhiJudge.Agent.Executor.Communication;
using Supabase.Realtime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PhiJudge.Agent.Executor.Services
{
    internal class DataExchangeService : IDataExchangeService, IDisposable
    {
        private readonly Supabase.Client SupabaseClient;
        private readonly HttpClient HttpClient;

        private readonly IExecutionService _executionService;
        private readonly ILogger<DataExchangeService> _logger;

        public DataExchangeService(IExecutionService executionService, ILogger<DataExchangeService> logger)
        {
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");

            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true
            };

            SupabaseClient = new Supabase.Client(url!, key, options);

            HttpClient = new()
            {
                BaseAddress = new Uri(Environment.GetEnvironmentVariable("CENTRAL_SERVER_URL")!)
            };

            _executionService = executionService;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            await SupabaseClient.InitializeAsync();

            var allocChannel = SupabaseClient.Realtime.Channel(RecordAllocationBroadcast.ChannelName);
            var allocSubscription = allocChannel.Register<RecordAllocationBroadcast>();

            allocSubscription.AddBroadcastEventHandler((sender, broadcast) =>
            {
                var response = allocSubscription.Current();

                if (response != null)
                {
                    if (response.AgentId == Environment.GetEnvironmentVariable("AGENT_ID"))
                    {
                        _logger.LogInformation("Running tests for record {0}", response.RecordId);

                        _executionService.RunAsync(response.RecordId).Start();
                    }
                }
            });

            await allocChannel.Subscribe();
            _logger.LogInformation("Successfully connected to Supabase realtime channel");
        }

        public async Task<RecordData> FetchRecordAsync(long recordId)
        {
            var response = await HttpClient.GetAsync($"/api/agent/record/{recordId}");
            var content = await response.Content.ReadAsStringAsync();

            var recordData = JsonSerializer.Deserialize<RecordData>(content)!;
            _logger.LogInformation("Successfully fetched data of record {0}", recordId);

            return recordData;
        }

        public async Task<ProblemData> FetchProblemAsync(long problemId)
        {
            var response = await HttpClient.GetAsync($"/api/agent/problem/{problemId}");
            var content = await response.Content.ReadAsStringAsync();

            var problemData = JsonSerializer.Deserialize<ProblemData>(content)!;
            _logger.LogInformation("Successfully fetched data of record {0}", problemId);

            return problemData;
        }

        public async Task<bool> PushCompilationResultAsync(long recordId, CompilationResult compilationResult)
        {
            var response = await HttpClient.PostAsync($"/api/agent/record/{recordId}/compilation", new StringContent(JsonSerializer.Serialize(compilationResult), Encoding.UTF8, "application/json"));
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> PushExecutionResultAsync(long recordId, ExecutionResult executionResult)
        {
            var response = await HttpClient.PostAsync($"/api/agent/record/{recordId}/execution", new StringContent(JsonSerializer.Serialize(executionResult), Encoding.UTF8, "application/json"));
            return response.IsSuccessStatusCode;
        }

        public void Dispose()
        {
            SupabaseClient.Realtime.Disconnect();
            _logger.LogInformation("Disconnected from Supabase realtime channels");
            HttpClient.Dispose();
        }
    }
}
