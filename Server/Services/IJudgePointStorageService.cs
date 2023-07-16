using PhiJudge.Server.Models.Judge;

namespace PhiJudge.Server.Services
{
    public interface IJudgePointStorageService
    {
        Task<IEnumerable<JudgePoint>> GetAllJudgePointsAsync(long problemId);

        Task<bool> AddJudgePointAsync(long problemId, JudgePoint testData);

        bool RemoveTestData(long problemId, int index);

        Task<bool> UpdateJudgePointsAsync(long problemId, IEnumerable<JudgePoint> testData);
    }
}
