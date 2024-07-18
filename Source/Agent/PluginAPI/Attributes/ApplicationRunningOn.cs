namespace PhiJudge.Agent.API.Plugin.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class ApplicationRunningOn(RunningOnType runningOnType) : Attribute
    {
        public RunningOnType RunningOnType { get; } = runningOnType;
    }
}
