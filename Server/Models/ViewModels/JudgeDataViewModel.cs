namespace PhiJudge.Server.Models.ViewModels
{
    public class JudgeDataViewModel
    {
        public long Id { get; set; }

        public IEnumerable<JudgePoint> JudgePoints { get; set; }

        public long MemoryLimitBytes { get; set; }

        public long TimeLimitBytes { get; set; }
    }
}
