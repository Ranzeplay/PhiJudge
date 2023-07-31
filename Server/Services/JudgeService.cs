using Microsoft.EntityFrameworkCore;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.ViewModels.Agent;

namespace PhiJudge.Server.Services
{
    public class JudgeService : IJudgeService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly HttpClient _httpClient;

        public JudgeService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _httpClient = new HttpClient();
        }

        public async Task<bool> SendToAgentAsync(Guid agentId, long recordId)
        {
            var agent = (await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == agentId))!;
            var record = (await _dbContext.Records.FirstOrDefaultAsync(r => r.Id == recordId))!;

            var queueUrl = $"http://{agent.LastNetworkAddress}/api/judge/queue";
            var response = await _httpClient.PostAsJsonAsync(queueUrl, new JudgeQueueViewModel(recordId));
            if (response.IsSuccessStatusCode)
            {
                record.Status = Models.Judge.JudgeStatus.Queued;
                record.AgentId = agent.Id;

                _dbContext.Records.Update(record);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
