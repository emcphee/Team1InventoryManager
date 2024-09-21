using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WarehouseInventoryManager.Models;
using WarehouseInventoryManager.DTOs;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController : InventoryManagerBaseController 
    {
        public WarehouseController(WarehouseInventoryManagementDbContext context) : base(context)
        {
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] WarehouseModel model)
        {
            if (CurrentUser == null) return Unauthorized("Invalid session or user not found");

            try
            {
                // insert warehouse
                Warehouse warehouse = new Warehouse(model.Name, model.Address);
                _context.Warehouses.Add(warehouse);
                
                _context.SaveChanges(); // save to generate warehouseId

                // insert admin permission for CurrentUser
                _context.UserPermissions.Add(new UserPermission(CurrentUser.UserId, warehouse.WarehouseId, 1));

                // save
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Unknown error creating warehouse.");
            }

            return Ok();
        }
    }
}
