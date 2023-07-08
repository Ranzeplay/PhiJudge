using Microsoft.Extensions.Options;
using PhiJudge.Server.Models;

namespace PhiJudge.Server.Services
{
    public class JudgePointFileStorageService : IJudgePointStorageService
    {
        private readonly AppSettings _appSettings;

        public JudgePointFileStorageService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public async Task<bool> AddJudgePointAsync(long problemId, JudgePoint testData)
        {
            var judgePointPath = Path.Combine(_appSettings.StorageDataPath,
                                              "JudgePoints",
                                              problemId.ToString(),
                                              (await GetAllJudgePointsAsync(problemId)).Count().ToString());

            if(!Directory.Exists(judgePointPath))
            {
                Directory.CreateDirectory(judgePointPath);
            }

            await File.AppendAllTextAsync(Path.Combine(judgePointPath, "input.txt"), testData.Input);
            await File.AppendAllTextAsync(Path.Combine(judgePointPath, "output.txt"), testData.Output);

            return true;
        }

        public async Task<IEnumerable<JudgePoint>> GetAllJudgePointsAsync(long problemId)
        {
            var judgePointsPath = Path.Combine(_appSettings.StorageDataPath,
                                              "JudgePoints",
                                              problemId.ToString());
            if (!Directory.Exists(judgePointsPath))
            {
                Directory.CreateDirectory(judgePointsPath);
            }

            var result = new List<JudgePoint>();

            var points = Directory.EnumerateDirectories(judgePointsPath).ToArray();
            foreach (var point in points)
            {
                // var pointPath = Path.Combine(judgePointsPath, point!);
                var pointPath = point;

                var input = await File.ReadAllTextAsync(Path.Combine(pointPath, "input.txt"));
                var output = await File.ReadAllTextAsync(Path.Combine(pointPath, "output.txt"));

                var name = new DirectoryInfo(pointPath).Name;

                result.Add(new JudgePoint
                {
                    Index = int.Parse(name!),
                    Input = input,
                    Output = output
                });
            }

            return result;
        }

        public bool RemoveTestData(long problemId, int index)
        {
            var judgePointPath = Path.Combine(_appSettings.StorageDataPath,
                                              "JudgePoints",
                                              problemId.ToString(),
                                              index.ToString());

            Directory.Delete(judgePointPath, true);

            // TODO: Re-arrange judge points

            return true;
        }

        public async Task<bool> UpdateJudgePointsAsync(long problemId, IEnumerable<JudgePoint> judgePoints)
        {
            var judgePointsPath = Path.Combine(_appSettings.StorageDataPath,
                                              "JudgePoints",
                                              problemId.ToString());
            Directory.Delete(judgePointsPath, true);

            // TODO: Re-arrange judge points

            foreach (var point in judgePoints)
            {
                await AddJudgePointAsync(problemId, point);
            }

            return true;
        }
    }
}
