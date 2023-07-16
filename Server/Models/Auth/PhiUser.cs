using Microsoft.AspNetCore.Identity;
using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Models.Auth
{
    public class PhiUser : IdentityUser
    {
        public override string Id { get => base.Id; set => base.Id = value; }

        public override string Email { get => base.Email; set => base.Email = value; }

        public override string UserName { get => base.UserName; set => base.UserName = value; }

        public DateTime CreateTime { get; set; }

        public IEnumerable<SubmitRecord> Submits { get; set; }

        public IEnumerable<Problem> CreatedProblems { get; set; }
    }
}
