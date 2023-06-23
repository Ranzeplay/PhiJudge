namespace PhiJudge.Server.Models
{
    public class Agent
    {
        public Guid Id { get; set; }

        public string AgentName { get; set; }

        public string AccessToken { get; set; }

        public DateTime AuthorizationTime { get; set; }

        public AgentStatus Status { get; set; }

        public string LastNetworkAddress { get; set; }
    }
}
