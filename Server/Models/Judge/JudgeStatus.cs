namespace PhiJudge.Server.Models.Judge
{
    public enum JudgeStatus
    {
        Unknown = 0,
        Submitted = 1,
        Queued = 2,
        Compiling = 3,
        Success = 4,
        Fail = 5,
        Cancelled = 6,
        Abort = 7,
    }
}
