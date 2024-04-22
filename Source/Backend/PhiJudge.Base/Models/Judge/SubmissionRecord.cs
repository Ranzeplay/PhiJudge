using PhiJudge.Base.Models.Auth;

namespace PhiJudge.Base.Models.Judge
{
    public class SubmissionRecord
    {
        public long Id { get; set; }

        public JudgeStatus Status { get; set; }

        public Problem Problem { get; set; }

        public PhiUser Uploader { get; set; }

        public Agent AllocatedAgent { get; set; }

        public string SourceCode { get; set; }

        public string LanguageId { get; set; }

        public DateTime SubmittedAt { get; set; }

        public string CompilationOutput { get; set; }

        public IEnumerable<JudgePointResult> JudgePointResults { get; set; }
    }
}
