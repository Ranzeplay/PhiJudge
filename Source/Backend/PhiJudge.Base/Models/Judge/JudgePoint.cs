namespace PhiJudge.Base.Models.Judge
{
    public class JudgePoint
    {
        public Guid Id { get; set; }

        public Problem Problem { get; set; }

        public string ExpectedInput { get; set; }

        public string ExpectedOutput { get; set; }
    }
}
