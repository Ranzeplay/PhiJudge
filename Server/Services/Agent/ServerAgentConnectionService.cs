using Grpc.Core;
using PhiJudge.Server.Data;
using PhiJudge.Server.Protos;

namespace PhiJudge.Server.Services.Agent
{
    public class ServerAgentConnectionService : AgentConnectionService.AgentConnectionServiceBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ServerAgentConnectionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override Task<AgentConnectReply> AgentConnect(AgentConnectRequest request, ServerCallContext context)
        {
            return Task.FromResult(new AgentConnectReply
            {
                Status = false,
                Reason = "Not implemented"
            });
        }

        public override Task<ServerDisconnectReply> ServerDisconnect(ServerDisconnectRequest request, ServerCallContext context)
        {
            return Task.FromResult(new ServerDisconnectReply
            {
                Status = false,
                Reason = "Not implemented"
            });
        }
    }
}
