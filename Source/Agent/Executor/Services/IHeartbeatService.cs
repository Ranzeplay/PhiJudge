namespace PhiJudge.Agent.Executor.Services
{
    internal interface IHeartbeatService : IDisposable
    {
        public void Begin();
        public void End();
    }
}
