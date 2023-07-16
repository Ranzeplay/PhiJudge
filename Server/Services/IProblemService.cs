using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Services
{
    public interface IProblemService
    {
        Problem? UserGetByIdAsync(long id);
        Task<Problem?> UserGetById(long id);
        Problem? PrivilegedGetById(long id);
    }
}
