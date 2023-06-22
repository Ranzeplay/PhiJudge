namespace PhiJudge.Server.Models
{
    public class SubmitRecord
    {
        public long Id { get; set; }

        public Problem Problem { get; set; }

        public PhiUser Uploader { get; set; }

        public string SourceCode { get; set; }

        public DateTime SubmitTime { get; set; }

        public string LanguageId { get; set; }

        public IEnumerable<AgentJudgePoint> JudgePoints { get; set; }
    }
}
