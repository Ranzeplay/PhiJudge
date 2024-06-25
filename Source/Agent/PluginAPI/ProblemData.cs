using System.Text.Json.Serialization;

namespace PhiJudge.Agent.API.Plugin
{
    public class ProblemData(long id, IEnumerable<TestPointData> testPoints)
    {
        [JsonPropertyName("id")]
        public long Id { get; set; } = id;

        [JsonPropertyName("testPoints")]
        public IEnumerable<TestPointData> TestPoints { get; set; } = testPoints;
    }
}
