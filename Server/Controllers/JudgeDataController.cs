using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models;
using PhiJudge.Server.Models.ViewModels;
using PhiJudge.Server.Services;

namespace PhiJudge.Server.Controllers
{
    [Route("api/judge-data")]
    [ApiController]
    public class JudgeDataController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IJudgePointStorageService _judgePointStorageService;

        public JudgeDataController(ApplicationDbContext dbContext, IJudgePointStorageService judgePointStorageService)
        {
            _dbContext = dbContext;
            _judgePointStorageService = judgePointStorageService;
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var problem = _dbContext.Problems.FirstOrDefault(p => p.Id == id);

            if (problem == null || problem.ViewStatus == ProblemViewStatus.Available)
            {
                return NotFound("Problem not found");
            }

            var data = await _judgePointStorageService.GetAllJudgePointsAsync(id);

            return Ok(new JudgeDataViewModel
            {
                Id = id,
                MemoryLimitBytes = problem.MemoryLimit,
                TimeLimitBytes = problem.TimeLimit,
                JudgePoints = data
            });
        }
    }
}
