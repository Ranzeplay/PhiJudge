using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using PhiJudge.Server.Data;
using PhiJudge.Server.Protos;

namespace PhiJudge.Server.Services.Agent
{
    public class ServerAgentAuthorizationService : AgentAuthorizationService.AgentAuthorizationServiceBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ServerAgentAuthorizationService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override async Task<AuthorizeReply> Authorize(AuthorizeRequest request, ServerCallContext context)
        {
            var agent = new Models.Agent
            {
                Id = Guid.NewGuid(),
                AccessToken = Guid.NewGuid().ToString(),
                AgentName = request.Name,
                AuthorizationTime = DateTime.UtcNow,
                Status = Models.AgentStatus.NotAuthorized,
                LastNetworkAddress = context.Peer
            };

            await _dbContext.Agents.AddAsync(agent);

            await _dbContext.SaveChangesAsync();

            return new AuthorizeReply
            {
                Status = true,
                AgentId = agent.Id.ToString(),
                AccessToken = agent.AccessToken,
            };
        }

        public override async Task<UnauthorizeReply> Unauthorize(UnauthorizeRequest request, ServerCallContext context)
        {
            Guid.TryParse(request.AgentId, out var agentId);

            var agent = await _dbContext.Agents.FirstOrDefaultAsync(a => a.Id == agentId);
            if (agent == null)
            {
                return new UnauthorizeReply
                {
                    Status = "Failed",
                    Reason = "Agent not found"
                };
            }
            else if (agent.AccessToken != request.AccessToken)
            {
                return new UnauthorizeReply
                {
                    Status = "Failed",
                    Reason = "Incorrect access token"
                };
            }

            agent.Status = Models.AgentStatus.NotAuthorized;
            agent.LastNetworkAddress = context.Peer;

            _dbContext.Agents.Update(agent);
            await _dbContext.SaveChangesAsync();

            return new UnauthorizeReply
            {
                Status = "Success"
            };
        }
    }
}
