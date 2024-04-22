namespace PhiJudge.Base.Models.Judge
{
    public class JudgePointResult
    {
        public long RecordId { get; set; }

        public Problem Problem { get; set; }

        public JudgePoint JudgePoint { get; set; }

        public string ActualOutput { get; set; }

        public PointStatus Status { get; set; }

        public long TimeMilliseconds { get; set; }

        public long PeakMemoryBytes { get; set; }
    }
}
