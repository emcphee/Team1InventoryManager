using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseInventoryManager.DTOs;
using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : InventoryManagerBaseController
    {
        public ItemController(WarehouseInventoryManagementDbContext context) : base(context)
        {
        }

        [HttpPost]
        public IActionResult CreateItem([FromBody] ItemCreateDTO model)
        {
            if (model.ItemName == null || model.Amount == null || model.WarehouseId == null) return BadRequest();
            if (!UserHasPermission((int)model.WarehouseId, Permissionlevel.Editor)) return Unauthorized();

            try
            {
                if (_context.Items.FirstOrDefault(item => model.WarehouseId == item.WarehouseId && model.ItemName == item.ItemName) != null) return BadRequest("Item already exists with that name");
                var item = new Item((int)model.WarehouseId, (int)model.Amount, model.ItemName);
                _context.Items.Add(item);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error adding item");
            }
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            if (CurrentUser == null) return Unauthorized();
            var item = _context.Items.Find(id);
            if (item == null) return NotFound(); 
            if (!UserHasPermission((int)item.WarehouseId, Permissionlevel.Admin)) return Unauthorized();

            try
            {
                _context.Items.Remove(item);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error deleting item");
            }

            return Ok();
        }

        [HttpPatch("{id}")]
        public IActionResult PatchItem(int id, [FromBody] ItemCreateDTO model)
        {
            if (CurrentUser == null) return Unauthorized();

            var item = _context.Items.Find(id);
            if (item == null) return NotFound();
            if (!UserHasPermission((int)item.WarehouseId, Permissionlevel.Admin)) return Unauthorized();

            var warehouse = _context.Warehouses.Find(id);
            if (warehouse == null) return NotFound();
            try
            {
                //if (model.Name != null) warehouse.Name = model.Name;
                //if (model.Address != null) warehouse.Address = model.Address;
                //_context.Warehouses.Update(warehouse);
                //_context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error patching warehouse");
            }
            return Ok();
        }
    }
}
