using System.ComponentModel.DataAnnotations;

namespace PhiJudge.Server.Models.ViewModels
{
    public class CreateProblemViewModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public long MemoryLimit { get; set; }

        [Required]
        public long TimeLimit { get; set; }

        [Required]
        public string PotentialSolutionSourceCode { get; set; }
    }
}
