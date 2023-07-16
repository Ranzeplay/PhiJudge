namespace PhiJudge.Server.Models.Judge
{
    public class AgentJudgePointResult
    {
        public long RecordId { get; set; }

        public int PointId { get; set; }

        public int PointIndex { get; set; }

        public string ActualOutput { get; set; }

        public PointStatus Status { get; set; }

        public long TimeMilliseconds { get; set; }

        public long PeakMemory { get; set; }
    }
}
