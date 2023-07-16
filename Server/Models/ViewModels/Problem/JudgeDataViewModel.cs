using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Models.ViewModels.Problem
{
    public class JudgeDataViewModel
    {
        public long Id { get; set; }

        public IEnumerable<JudgePoint> JudgePoints { get; set; }

        public long MemoryLimitBytes { get; set; }

        public long TimeLimitBytes { get; set; }
    }
}
