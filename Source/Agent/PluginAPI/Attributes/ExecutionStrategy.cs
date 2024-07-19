namespace PhiJudge.Agent.API.Plugin.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class ExecutionStrategy(ExecutionType type) : Attribute
    {
        public ExecutionType Type { get; } = type;
    }
}
