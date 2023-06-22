namespace PhiJudge.Server.Models.ViewModels
{
    public class JudgePointUploadModel : ProblemViewModelBase
    {
        public IFormFile InputData { get; set; }

        public IFormFile OutputData { get; set; }
    }
}
