using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Services
{
    public interface IProblemService
    {
        Problem? GetById(long id);
        Task<Problem?> GetByIdAsync(long id);
        Problem? PrivilegedGetById(long id);
    }
}
