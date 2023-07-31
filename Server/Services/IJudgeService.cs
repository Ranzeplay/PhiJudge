namespace PhiJudge.Server.Services
{
    public interface IJudgeService
    {
        Task<bool> SendToAgentAsync(Guid agentId, long recordId);
    }
}
