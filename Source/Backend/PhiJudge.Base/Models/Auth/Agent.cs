namespace PhiJudge.Base.Models.Auth
{
    public class Agent
    {
        public Guid Id { get; set; }

        public string AgentName { get; set; }

        public string AccessTokenHash { get; set; }

        public DateTime LastAuthorizedAt { get; set; }

        public AgentStatus Status { get; set; }

        public string LastNetworkAddress { get; set; }
    }
}
