using Microsoft.Extensions.Logging;
using PhiJudge.Agent.API.Plugin;
using PhiJudge.Agent.API.Plugin.Stages;
using PhiJudge.Agent.Executor.Communication;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace PhiJudge.Agent.Executor.Services
{
    internal class DataExchangeService : IDataExchangeService, IDisposable
    {
        private readonly Supabase.Client SupabaseClient;
        private readonly HttpClient HttpClient;
        public event EventHandler<long>? RecordAllocationBroadcastReceived;

        private readonly ILogger<DataExchangeService> _logger;

        public DataExchangeService(ILogger<DataExchangeService> logger)
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
                BaseAddress = new Uri(Environment.GetEnvironmentVariable("CENTRAL_SERVER_URL")!),
                DefaultRequestHeaders =
                {
                    Authorization = new AuthenticationHeaderValue(Environment.GetEnvironmentVariable("AGENT_ID") ?? string.Empty),
                    Accept = { new MediaTypeWithQualityHeaderValue("application/json") },
                    UserAgent = { { new ProductInfoHeaderValue("PhiJudge-Agent", "0.1") } }
                }
            };

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
                _logger.LogInformation("Received record allocation broadcast");

                if (response != null)
                {
                    if (response.Payload!["agentId"] as string == Environment.GetEnvironmentVariable("AGENT_ID"))
                    {
                        _logger.LogInformation("Running tests for record {0}", response.Payload!["recordId"]);
                        RecordAllocationBroadcastReceived?.Invoke(this, (long)response.Payload!["recordId"]);
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

        public async Task BeginCompilationAsync(long recordId)
        {
            var response = await HttpClient.GetAsync($"/api/agent/record/{recordId}/compilation/begin");
            _logger.LogInformation("Compilation started for record {0}", recordId);
        }

        public async Task<bool> PushCompilationResultAsync(long recordId, CompilationResult compilationResult)
        {
            var response = await HttpClient.PostAsync($"/api/agent/record/{recordId}/compilation", JsonContent.Create(compilationResult));
            return response.IsSuccessStatusCode;
        }

        public async Task BeginExecutionAsync(long recordId)
        {
            await HttpClient.GetAsync($"/api/agent/record/{recordId}/execution/begin");
            _logger.LogInformation("Execution started for record {0}", recordId);
        }

        public async Task<bool> PushExecutionResultAsync(long recordId, ExecutionResult executionResult)
        {
            var response = await HttpClient.PostAsync($"/api/agent/record/{recordId}/execution", JsonContent.Create(executionResult));
            return response.IsSuccessStatusCode;
        }

        public async Task FinishExecutionAsync(long recordId)
        {
            await HttpClient.GetAsync($"/api/agent/record/{recordId}/execution/finish");
            _logger.LogInformation("Finished execution for record {0}", recordId);
        }

        public void Dispose()
        {
            SupabaseClient.Realtime.Disconnect();
            _logger.LogInformation("Disconnected from Supabase realtime channels");
            HttpClient.Dispose();
        }

        public void AddRecordAllocationHandler(EventHandler<long> handler)
        {
            RecordAllocationBroadcastReceived += handler;
        }

        public async Task SendHeartbeatSignalAsync()
        {
            await HttpClient.GetAsync($"/api/agent/heartbeat/{Environment.GetEnvironmentVariable("AGENT_ID")}");
            _logger.LogInformation("Heartbeat signal sent");
        }

        public async void UpdateSupportedLanguagesAsync(IEnumerable<string> languages)
        {
            await HttpClient.PostAsync($"/api/agent/languages", JsonContent.Create(languages));
            _logger.LogInformation("Updated supported languages on server side");
        }
    }
}
