using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseInventoryManager.Models;
using WarehouseInventoryManager.DTOs;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController : InventoryManagerBaseController 
    {
        public WarehouseController(WarehouseInventoryDbContext context) : base(context)
        {
        }

        [HttpPost()]
        public IActionResult CreateWarehouse([FromBody] WarehousePostDTO model)
        {
            if (CurrentUser == null) return Unauthorized();
            if (model.Name == null || model.Address == null) return BadRequest();
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
        
        // returns warehouse info + all items
        [HttpGet("{id}")]
        public IActionResult GetWarehouse(int id)
        {
            if (CurrentUser == null) return Unauthorized();
            if (!UserHasPermission(id, Permissionlevel.Viewer)) return Unauthorized();

            // create object which contains warehouse info + all items and return here
            Warehouse? warehouse = _context.Warehouses.Find(id);
            if(warehouse == null) return NotFound("Warehouse doesn't exist.");

            // add permission level here if frontend wants it
            UserPermission? permission = _context.UserPermissions.Where(perm => perm.UserId == CurrentUser.UserId && perm.WarehouseId == id).FirstOrDefault();
            if (permission == null) return StatusCode(500, "Somehow your access to the database was removed between lines");

            
            List<Item> items = _context.Items.Where(item => item.WarehouseId == id).ToList();
            var result = new WarehouseGetWithItemsDTO(items, warehouse, permission, _context);

            return Ok(result);
        }
        
        // allows an Admin of a warehouse to DELETE a warehouse
        [HttpDelete("{id}")]
        public IActionResult DeleteWarehouse(int id)
        {
            if (CurrentUser == null) return Unauthorized();
            var warehouse = _context.Warehouses.Find(id);
            if (warehouse == null) return NotFound(); 
            if (!UserHasPermission(id, Permissionlevel.Admin)) return Unauthorized();

            try
            {
                _context.Warehouses.Remove(warehouse);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error deleting warehouse");
            }

            return Ok();
        }

        [HttpPatch("{id}")]
        public IActionResult PatchWarehouse(int id, [FromBody] WarehousePatchDTO model)
        {
            if (CurrentUser == null) return Unauthorized();
            if (_context.Warehouses.Find(id) == null) return NotFound();
            if (!UserHasPermission(id, Permissionlevel.Admin)) return Unauthorized();

            var warehouse = _context.Warehouses.Find(id);
            if (warehouse == null) return NotFound();
            if (model.isEmpty()) return BadRequest("No properties to PATCH provided");
            try
            {
                if (model.Name != null) warehouse.Name = model.Name;
                if (model.Address != null) warehouse.Address = model.Address;
                _context.Warehouses.Update(warehouse);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error patching warehouse");
            }
            return Ok();
        }

        [HttpGet("list")]
        public IActionResult ListWarehouses()
        {
            if (CurrentUser == null) return Unauthorized();
            
            // LINQ query generates a list of all Warehouses the requester has permissions for
            var query = from warehouse in _context.Warehouses
                        join permission in _context.UserPermissions
                        on warehouse.WarehouseId equals permission.WarehouseId
                        where permission.UserId == CurrentUser.UserId
                        select new WarehouseGetDTO
                        {
                            WarehouseId = warehouse.WarehouseId,
                            Name = warehouse.Name,
                            Address = warehouse.Address,
                            PermissionLevel = permission.Permission
                        };
            List<WarehouseGetDTO> list = query.ToList();
            var result = new WarehouseListDTO(list);

            return Ok(result);
        }

    }
}
