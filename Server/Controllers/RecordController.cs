using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.Auth;
using PhiJudge.Server.Models.Judge;
using PhiJudge.Server.Models.ViewModels.Judge;
using PhiJudge.Server.Services;

namespace PhiJudge.Server.Controllers
{
    [ApiController]
    [Route("api/record")]
    public class RecordController : ControllerBase
    {
        private readonly IProblemService _problemService;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<PhiUser> _userManager;

        public RecordController(IProblemService problemService, ApplicationDbContext dbContext, UserManager<PhiUser> userManager)
        {
            _problemService = problemService;
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit(RecordSubmitViewModel model)
        {
            var userId = User.Claims.Where(c => c.Type.Equals("uid")).First();
            var user = await _userManager.FindByIdAsync(userId.Value);

            var problem = _problemService.UserGetByIdAsync(model.ProblemId);

            if (problem == null)
            {
                return NotFound("Problem unavailable");
            }

            var judgePoints = new List<AgentJudgePointResult>();
            for (var i = 0; i < problem.TotalJudgePoints; i++)
            {
                judgePoints.Add(new AgentJudgePointResult
                {
                    PointIndex = i,
                    Status = PointStatus.Pending,
                    ActualOutput = string.Empty,
                    TimeMilliseconds = -1,
                    PeakMemory = -1,
                });
            }

            var record = new SubmitRecord
            {
                Problem = problem,
                SubmitTime = DateTime.UtcNow,
                Status = JudgeStatus.Pending,
                Uploader = user,
                LanguageId = model.LanguageId,
                SourceCode = model.SourceCode,
                CompileOutput = string.Empty,
                JudgePoints = judgePoints,
            };

            _dbContext.Records.Add(record);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
