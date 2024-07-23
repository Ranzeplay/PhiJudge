namespace PhiJudge.Agent.API.Plugin.Attributes
{
    /// <summary>
    /// The code running type of the execution stage, run each by executor or run all via calling the plugin at once.
    /// </summary>
    public enum ExecutionType
    {
        Single,
        Batch
    }
}