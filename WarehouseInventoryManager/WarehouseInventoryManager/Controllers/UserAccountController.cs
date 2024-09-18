using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WarehouseInventoryManager.DTOs;
using WarehouseInventoryManager.Models;


namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            WarehouseInventoryManagementDbContext dbContext = new WarehouseInventoryManagementDbContext();
            
            if(await dbContext.Users.FindAsync(model.Username) != null)
            {
                return BadRequest("User already exists");
            }

            return Ok();
        }
    }
}
