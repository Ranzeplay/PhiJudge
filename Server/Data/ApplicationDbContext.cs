using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PhiJudge.Server.Models.Auth;
using PhiJudge.Server.Models.Judge;
using System.Diagnostics.CodeAnalysis;

namespace PhiJudge.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<PhiUser>
    {
#pragma warning disable CS8618
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Problem> Problems { get; set; }

        public DbSet<SubmitRecord> Records { get; set; }

        public DbSet<AgentJudgePointResult> JudgePoints { get; set; }

        public DbSet<Agent> Agents { get; set; }
#pragma warning restore CS8618
    }
}
