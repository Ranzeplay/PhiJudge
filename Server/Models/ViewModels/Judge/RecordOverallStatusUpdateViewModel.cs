using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Models.ViewModels.Judge
{
    public class RecordOverallStatusUpdateViewModel
    {
        public long Id { get; set; }

        public JudgeStatus Status { get; set; }
    }
}
