using PhiJudge.Agent.API.Plugin.Enums;

namespace PhiJudge.Agent.API.Plugin
{
    public interface IEnvironmentRestricted
    {
        public EnvironmentType EnvironmentType { get; }
    }
}
