using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.Auth;

namespace PhiJudge.Server.Attributes
{
    public class AgentAuthorization : ActionFilterAttribute
    {
        private readonly ApplicationDbContext _dbContext;

        public AgentAuthorization(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var authorizationHeaderParts = context.HttpContext
                .Request
                .Headers["Authorization"]
                .ToString()
                .Replace("Agent ", "")
                .Split(' ');

            var agentIdText = authorizationHeaderParts[0];
            var accessToken = authorizationHeaderParts[1];

            _ = Guid.TryParse(agentIdText, out var agentId);

            var agent = _dbContext.Agents.FirstOrDefault(a => a.Id == agentId);
            if (agent == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            else if (agent.AccessToken != accessToken)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (agent.Status != AgentStatus.Authorized)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Check all right
            base.OnActionExecuting(context);
        }
    }
}
