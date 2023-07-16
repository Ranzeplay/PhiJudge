using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Services
{
    public interface IProblemService
    {
        Problem? GetByIdAsync(long id);
        Task<Problem?> GetById(long id);
        Problem? PrivilegedGetById(long id);
    }
}
