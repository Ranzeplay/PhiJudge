using Microsoft.EntityFrameworkCore;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Services
{
    public class ProblemService : IProblemService
    {
        private readonly ApplicationDbContext _dbContext;

        public ProblemService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Problem? GetById(long id)
        {
            var problem = _dbContext.Problems.FirstOrDefault(p => p.Id == id);
            if (problem == null)
            {
                return null;
            }

            if(problem.ViewStatus != ProblemViewStatus.Available)
            {
                return null;
            }

            return problem;
        }

        public async Task<Problem?> GetByIdAsync(long id)
        {
            var problem = await _dbContext.Problems.FirstOrDefaultAsync(p => p.Id == id);
            if (problem == null)
            {
                return null;
            }

            if (problem.ViewStatus != ProblemViewStatus.Available)
            {
                return null;
            }

            return problem;
        }

        public Problem? PrivilegedGetById(long id)
        {
            return _dbContext.Problems.FirstOrDefault(p => p.Id == id);
        }
    }
}
