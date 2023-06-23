using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PhiJudge.Server.Data;
using PhiJudge.Server.Models;
using PhiJudge.Server.Services;
using PhiJudge.Server.Services.Agent;
using System.Text;

namespace PhiJudge.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.ResolveConflictingActions(d => d.First());
                options.IgnoreObsoleteActions();
                options.IgnoreObsoleteProperties();
                options.CustomSchemaIds(t => t.FullName);
            });

            builder.Services.AddIdentity<PhiUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnection"));
            });

            builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("AuthConfig"));
            var jwtConfig = builder.Configuration.GetSection("AuthConfig").Get<JwtConfig>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = jwtConfig.Audience,
                    ValidIssuer = jwtConfig.Issuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key)),
                };
            });

            builder.Services.AddScoped<IJudgePointStorageService, JudgePointFileStorageService>();

            builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

            builder.Services.AddGrpc();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseCors(options => options.AllowAnyHeader()
                                              .AllowAnyMethod()
                                              .SetIsOriginAllowed(origin => true)
                                              .AllowCredentials());
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapGrpcService<ServerAgentAuthorizationService>();

            app.Run();
        }
    }
}