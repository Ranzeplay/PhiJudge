namespace PhiJudge.Server.Models.Auth
{
    public class JwtConfig
    {
        public string Key { get; set; }

        public string Secret { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public int ExpireMinute { get; set; }
    }
}
