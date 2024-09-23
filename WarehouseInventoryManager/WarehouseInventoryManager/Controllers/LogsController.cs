using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseInventoryManager.DTOs;
using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : InventoryManagerBaseController
    {
        public LogsController(WarehouseInventoryDbContext context) : base(context)
        {
        }

        [HttpGet("{id}")]
        public IActionResult GetLogs(int id)
        {
            if (CurrentUser == null) return Unauthorized();
            if (!UserHasPermission(id, Permissionlevel.Viewer)) return Unauthorized();

            var result = _context.Database.SqlQuery<LogDTO>($"EXEC DisplayLogs @WarehouseID = {id}").ToList();
            return Ok(result);
        }
    }
}
