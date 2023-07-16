using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PhiJudge.Server.Models.Auth;
using PhiJudge.Server.Models.ViewModels.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PhiJudge.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<PhiUser> _userManager;
        private readonly SignInManager<PhiUser> _signInManager;
        private readonly JwtConfig _jwtConfig;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;

        public UserController(UserManager<PhiUser> userManager, SignInManager<PhiUser> signInManager, IOptions<JwtConfig> options)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtConfig = options.Value;
            _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpViewModel model)
        {
            var user = new PhiUser
            {
                Email = model.Email,
                UserName = model.UserName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Created(string.Empty, new { model.Email, model.UserName });
            }
            else
            {
                return Conflict(result.Errors);
            }
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("User not found!");
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (signInResult.Succeeded)
            {
                // Generate JWT token
                var issueTime = DateTime.UtcNow;
                var expire = issueTime.AddMinutes(_jwtConfig.ExpireMinute);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Iss, _jwtConfig.Issuer),
                    new Claim(JwtRegisteredClaimNames.Aud, _jwtConfig.Audience),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("uid", user.Id),
                    new Claim(JwtRegisteredClaimNames.Iat, issueTime.ToString()),
                    new Claim(JwtRegisteredClaimNames.Exp, expire.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _jwtConfig.Issuer,
                    _jwtConfig.Audience,
                    claims,
                    expires: expire,
                    signingCredentials: credentials
                    );

                return Ok(_jwtSecurityTokenHandler.WriteToken(token));
            }
            else
            {
                return Unauthorized("Incorrect password");
            }
        }

        [HttpGet("check")]
        public IActionResult CheckSignInStatus()
        {
            if (User.Identity.IsAuthenticated)
            {
                var encodedToken = Request.Headers.Authorization
                    .First()
                    .Replace("Bearer ", "");

                var token = _jwtSecurityTokenHandler.ReadJwtToken(encodedToken);
                var claims = new Dictionary<string, string>();
                token.Claims.ToList().ForEach(c =>
                {
                    claims[c.Type] = c.Value;
                });

                return Ok(new
                {
                    Email = claims[JwtRegisteredClaimNames.Email],
                    Expire = claims[JwtRegisteredClaimNames.Exp],
                    IssueTime = claims[JwtRegisteredClaimNames.Iat]
                });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
