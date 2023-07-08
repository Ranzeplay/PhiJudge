using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models;
using PhiJudge.Server.Models.ViewModels;
using PhiJudge.Server.Models.ViewModels.Agent;

namespace PhiJudge.Server.Controllers
{
    [Route("api/agent")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public AgentController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPut("auth")]
        public async Task<IActionResult> Auth(AgentRegisterModel model)
        {
            var agent = new Agent
            {
                Id = Guid.NewGuid(),
                AccessToken = Guid.NewGuid().ToString(),
                AgentName = model.Name,
                AuthorizationTime = DateTime.UtcNow,
                Status = AgentStatus.NotAuthorized,
                LastNetworkAddress = HttpContext.Connection.RemoteIpAddress!.ToString()
            };

            await _dbContext.Agents.AddAsync(agent);

            await _dbContext.SaveChangesAsync();

            return Ok(new AgentRegisterReplyModel
            {
                Success = true,
                AgentId = agent.Id.ToString(),
                AccessToken = agent.AccessToken,
            });
        }

        [HttpDelete("auth")]
        public async Task<IActionResult> Auth(AgentDeleteModel model)
        {
            _ = Guid.TryParse(model.AgentId, out var agentId);

            var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == agentId);
            if (agent == null)
            {
                return Unauthorized(new AgentDeleteReplyModel
                {
                    Success = true,
                    Reason = "Agent not found"
                });
            }
            else if (agent.AccessToken != model.AccessToken)
            { 
                return Unauthorized(new AgentDeleteReplyModel
                {
                    Success = true,
                    Reason = "Incorrect access token"
                });
            }

            agent.Status = AgentStatus.NotAuthorized;
            agent.LastNetworkAddress = HttpContext.Connection.RemoteIpAddress!.ToString();

            _dbContext.Agents.Update(agent);
            await _dbContext.SaveChangesAsync();

            return Ok(new AgentDeleteReplyModel
            {
                Success = true
            });
        }
    }
}
