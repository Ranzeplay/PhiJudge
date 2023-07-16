using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.Auth;
using PhiJudge.Server.Models.Judge;
using PhiJudge.Server.Models.ViewModels.Problem;
using PhiJudge.Server.Services;

namespace PhiJudge.Server.Controllers
{
    [ApiController]
    [Route("api/problem")]
    public class ProblemController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<PhiUser> _userManager;

        private readonly IJudgePointStorageService _judgePointStorageService;

        public ProblemController(ApplicationDbContext dbContext, UserManager<PhiUser> userManager, IJudgePointStorageService judgePointStorageService)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _judgePointStorageService = judgePointStorageService;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] CreateProblemViewModel model)
        {
            var userId = User.Claims.Where(c => c.Type.Equals("uid")).First();
            var user = await _userManager.FindByIdAsync(userId.Value);

            var problem = new Problem
            {
                Title = model.Title,
                Description = model.Description,
                Author = user,
                ViewStatus = ProblemViewStatus.Incomplete,
                PotentialSolutionSourceCode = model.PotentialSolutionSourceCode,
                TotalJudgePoints = 0,
                TimeLimit = model.TimeLimit,
                MemoryLimit = model.MemoryLimit,
                CreateTime = DateTime.UtcNow,
                AccessToken = Guid.NewGuid().ToString(),
            };

            var result = await _dbContext.Problems.AddAsync(problem);
            problem = result.Entity;

            await _dbContext.SaveChangesAsync();

            return Ok(new CreateProblemReturnViewModel
            {
                ProblemId = problem.Id,
                AccessToken = problem.AccessToken
            });
        }

        [HttpPut("upload-test-data")]
        public async Task<IActionResult> UploadJudgePoint([FromForm] JudgePointUploadModel model)
        {
            var problem = _dbContext.Problems.FirstOrDefault(p => p.Id == model.ProblemId);
            if (problem == null)
            {
                return NotFound($"Problem {model.ProblemId} not found");
            }
            if (problem.AccessToken != model.AccessToken)
            {
                return Unauthorized("Incorrect access token");
            }

            // Save test data
            var existingPoints = await _judgePointStorageService.GetAllJudgePointsAsync(model.ProblemId);

            var input = string.Empty;
            using (var reader = new StreamReader(model.InputData.OpenReadStream()))
            {
                input = await reader.ReadToEndAsync();
            }

            var output = string.Empty;
            using (var reader = new StreamReader(model.OutputData.OpenReadStream()))
            {
                output = await reader.ReadToEndAsync();
            }

            await _judgePointStorageService.AddJudgePointAsync(model.ProblemId, new JudgePoint
            {
                Index = existingPoints.Count(),
                Input = input,
                Output = output
            });

            problem.TotalJudgePoints++;

            _dbContext.Problems.Update(problem);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("complete-creation")]
        public IActionResult CompleteCreation([FromForm] ProblemViewModelBase model)
        {
            var problem = _dbContext.Problems.FirstOrDefault(p => p.Id == model.ProblemId);
            if (problem == null)
            {
                return NotFound($"Problem {model.ProblemId} not found");
            }
            if (problem.AccessToken != model.AccessToken)
            {
                return Unauthorized("Incorrect access token");
            }

            if (problem.TotalJudgePoints == 0)
            {
                return BadRequest("No judge points");
            }

            problem.ViewStatus = ProblemViewStatus.Uploaded;

            return Ok(problem);
        }
    }
}
