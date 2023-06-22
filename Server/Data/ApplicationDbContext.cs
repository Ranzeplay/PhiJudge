using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PhiJudge.Server.Models;

namespace PhiJudge.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<PhiUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Problem> Problems { get; set; }

        public DbSet<SubmitRecord> Records { get; set; }

        public DbSet<AgentJudgePoint> JudgePoints { get; set; }
    }
}
