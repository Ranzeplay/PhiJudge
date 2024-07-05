namespace PhiJudge.Agent.Executor.Services
{
    internal class HeartbeatService : IHeartbeatService
    {
        private readonly Thread Thread;

        private readonly IDataExchangeService _dataExchangeService;

        public HeartbeatService(IDataExchangeService dataExchangeService)
        {
            _dataExchangeService = dataExchangeService;
            Thread = new Thread(async () =>
            {
                var timer = new PeriodicTimer(TimeSpan.FromMinutes(5));
                do
                {
                    await _dataExchangeService.SendHeartbeatSignalAsync();
                }
                while (await timer.WaitForNextTickAsync());
            });
        }

        public void Begin()
        {
            Thread.Start();
        }

        public void Dispose()
        {
            End();
        }

        public void End()
        {
            Thread.Interrupt();
        }
    }
}
