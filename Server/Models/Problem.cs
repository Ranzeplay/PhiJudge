namespace PhiJudge.Server.Models
{
    public class Problem
    {
        public long Id { get; set; }

        public string AccessToken { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public PhiUser Author { get; set; }

        public DateTime CreateTime { get; set; }

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

        public long MemoryLimit { get; set; }

        public long TimeLimit { get; set; }

        public string PotentialSolutionSourceCode { get; set; }

        public int TotalJudgePoints { get; set; }
    }
}
