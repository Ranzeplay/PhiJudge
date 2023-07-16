using PhiJudge.Server.Models.Auth;

namespace PhiJudge.Server.Models.Judge
{
    public class SubmitRecord
    {
        public long Id { get; set; }

        public JudgeStatus Status { get; set; }

        public Problem Problem { get; set; }

        public PhiUser Uploader { get; set; }

        public string SourceCode { get; set; }

        public DateTime SubmitTime { get; set; }

        public string LanguageId { get; set; }

        public string CompileOutput { get; set; }

        public IEnumerable<AgentJudgePointResult> JudgePoints { get; set; }
    }
}
