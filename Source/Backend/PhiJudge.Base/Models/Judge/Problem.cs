using PhiJudge.Base.Models.Auth;

namespace PhiJudge.Base.Models.Judge
{
    public class Problem
    {
        public long Id { get; set; }

        public string AccessTokenHash { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public PhiUser Author { get; set; }

        public DateTime CreatedAt { get; set; }

        public ProblemViewStatus ViewStatus { get; set; }

        public int TotalSubmits { get; set; }

        public int TotalPasses { get; set; }

        public double PassRate
        {
            get
            {
                return TotalSubmits == 0 ? 0 : TotalPasses / TotalSubmits;
            }
        }

        public long MemoryLimitBytes { get; set; }

        public long TimeLimitMilliseconds { get; set; }

        public IEnumerable<JudgePoint> JudgePoints { get; set; }
    }
}
