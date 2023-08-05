﻿using Microsoft.AspNetCore.Mvc;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.Judge;
using PhiJudge.Server.Models.ViewModels.Problem;
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

        [HttpGet("points/{id}")]
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
                TimeLimitMillis = problem.TimeLimit,
                JudgePoints = data
            });
        }

        [HttpGet("test-script")]
        public IActionResult GetTestScript(string langId)
        {
            return Ok();
        }
    }
}
