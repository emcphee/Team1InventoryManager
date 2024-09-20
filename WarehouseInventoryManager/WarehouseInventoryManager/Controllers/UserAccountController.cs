using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using WarehouseInventoryManager.DTOs;
using WarehouseInventoryManager.Models;
using WarehouseInventoryManager.Utils;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly WarehouseInventoryManagementDbContext _context;
        public UserAccountController(WarehouseInventoryManagementDbContext context)
        {
            _context = context;
        }



        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] LoginModel model)
        {
            // reject if username already exists
            if (_context.Users.FirstOrDefault(u => u.Username == model.Username) != null)
            {
                return BadRequest("User already exists");
            }
            try
            {
                // implement password validation if we want later

                // generate salt, hash password
                var (salt, hash) = CryptoUtils.HashPassword(model.Password);

                // store (username, pass, hash) in db
                User newUser = new User(model.Username, hash, salt);
                _context.Users.Add(newUser);
                _context.SaveChanges();
            }
            catch
            {
                Console.Error.WriteLine("Exception occured in register when trying to create user");
                return BadRequest("Error in processing registration parameters");
            }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, model.Username),
                    // Add additional claims as needed
                };

                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, // Persist the cookie across sessions
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

            // user has been successfully added to db
            return Ok(new { username = model.Username });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            User? user = _context.Users.FirstOrDefault(u => u.Username == model.Username);

            if (user == null)
            {
                return BadRequest("Incorrect Password"); // user doesn't exist, but should not disclose to everyone which usernames exist
            }

            if (!CryptoUtils.CheckPassword(model.Password, user.Salt, user.PasswordHash))
            {
                return BadRequest("Incorrect Password");
            }


            return Ok(new { username = model.Username });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Logged out");
        }
    }
}
