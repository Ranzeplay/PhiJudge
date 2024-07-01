using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace PhiJudge.Agent.Executor.Services
{
    internal class ConsoleService(IExecutionService executionService, ILogger<ConsoleService> logger) : BackgroundService
    {
        private readonly IExecutionService _executionService = executionService;
        private readonly ILogger<ConsoleService> _logger = logger;

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Beginning reading console input");

            return base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                string commandText = Console.ReadLine()!;

                if (commandText.StartsWith("run "))
                {
                    var recordId = commandText.Split(" ")[1];
                    await _executionService.RunAsync(int.Parse(recordId));
                }
                else
                {
                    _logger.LogWarning("Unknown command: {commandText}", commandText);
                }
            }
        }
    }
}
