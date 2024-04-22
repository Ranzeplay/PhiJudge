using PhiJudge.Base.Models.Judge;

namespace PhiJudge.Base.Models.Auth
{
    public class PhiUser
    {
        public Guid Id { get; set; }

        public string Email { get; set; }

        public string UserName { get; set; }

        public PhiUserRole Role { get; set; }

        public DateTime CreatedAt { get; set; }

        public IEnumerable<SubmissionRecord> Submits { get; set; }

        public IEnumerable<Problem> CreatedProblems { get; set; }
    }
}
