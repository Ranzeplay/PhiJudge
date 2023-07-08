using System.ComponentModel.DataAnnotations;

namespace PhiJudge.Server.Models.ViewModels.Agent
{
    public class AgentRegisterModel
    {
        [Required]
        public string Name { get; set; }
    }
}
