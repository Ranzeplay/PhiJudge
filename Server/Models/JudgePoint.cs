namespace PhiJudge.Server.Models
{
    public class JudgePoint
    {
        public long Id { get; set; }

        public int PointId { get; set; }

        public string ActualOutput { get; set; }

        public PointStatus Status { get; set; }

        public long TimeMilliseconds { get; set; }

        public long PeakMemory { get; set; }
    }
}
