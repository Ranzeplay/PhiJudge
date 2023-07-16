using Microsoft.AspNetCore.Mvc;
using PhiJudge.Server.Attributes;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.Judge;
using PhiJudge.Server.Models.ViewModels.Judge;

namespace PhiJudge.Server.Controllers
{
    [Route("api/agent/judge")]
    [ApiController]
    [ServiceFilter(typeof(AgentAuthorization))]
    public class AgentJudgeController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public AgentJudgeController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPatch("overall-status")]
        public async Task<IActionResult> UpdateOverallStatusAsync(RecordOverallStatusUpdateViewModel model)
        {
            var record = _dbContext.Records.FirstOrDefault(r => r.Id == model.Id);

            if (record == null)
            {
                return NotFound("Record not found");
            }

            record.Status = model.Status;

            _dbContext.Update(record);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPatch("point-status")]
        public async Task<IActionResult> UpdatePointStatusAsync(AgentJudgePointResult model)
        {
            var record = _dbContext.Records.FirstOrDefault(r => r.Id == model.RecordId);

            if (record == null)
            {
                return NotFound("Record not found");
            }

            var point = record.JudgePoints.FirstOrDefault(p => p.PointId == model.PointId);
            if (point == null)
            {
                return NotFound("Judge point not found");
            }

            _dbContext.JudgePoints.Update(model);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPatch("compilation-output")]
        public async Task<IActionResult> UpdateCompilationOutputAsync(CompilationOutputUpdateViewModel model)
        {
            var record = _dbContext.Records.FirstOrDefault(r => r.Id == model.RecordId);

            if (record == null)
            {
                return NotFound("Record not found");
            }

            record.CompileOutput = model.CompilationOutput;

            _dbContext.Update(record);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
