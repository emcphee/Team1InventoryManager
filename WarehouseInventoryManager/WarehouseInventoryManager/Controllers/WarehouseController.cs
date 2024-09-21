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
        public IActionResult Create([FromBody] WarehouseCreateDTO model)
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

        // if we want to returns the UserPermissioon level of each Warehouse along with it, we should create a View, but otherwise dont need one.
        [HttpPost("list")]
        public IActionResult ListWarehouses([FromBody] WarehouseListDTO model)
        {
            if (CurrentUser == null) return Unauthorized("Invalid session or user not found");
            
            // LINQ query generates a list of all Warehouses the requester has permissions for
            var query = from warehouse in _context.Warehouses
                        join permission in _context.UserPermissions
                        on warehouse.WarehouseId equals permission.WarehouseId
                        where permission.UserId == 1
                        select new WarehouseDTO
                        {
                            WarehouseId = warehouse.WarehouseId,
                            Name = warehouse.Name,
                            Address = warehouse.Address,
                            PermissionLevel = permission.Permission
                        };
            List<WarehouseDTO> list = query.ToList();
            var result = new WarehouseListDTO(list);

            return Ok(result);
        }
    }
}
