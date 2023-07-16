namespace PhiJudge.Server.Models.Judge
{
    public enum JudgeStatus
    {
        Unknown = 0,
        Pending = 1,
        Compiling = 2,
        Success = 3,
        Fail,
        Cancelled = 4,
        Abort = 5,
    }
}
