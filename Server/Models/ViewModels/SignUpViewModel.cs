using System.ComponentModel.DataAnnotations;

namespace PhiJudge.Server.Models.ViewModels
{
    public class SignUpViewModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string UserName { get; set; }
    }
}
