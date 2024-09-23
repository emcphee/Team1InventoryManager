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
        public ItemController(WarehouseInventoryDbContext context) : base(context)
        {
        }

        [HttpPost]
        public IActionResult CreateItem([FromBody] ItemPostDTO model)
        {
            if (!UserHasPermission(model.WarehouseId, Permissionlevel.Editor)) return Unauthorized("You don't have permission to edit this database");

            try
            {
                if (_context.Items.FirstOrDefault(item => model.WarehouseId == item.WarehouseId && model.ItemName == item.ItemName) != null) return BadRequest("Item already exists with that name");
                var item = new Item(model.WarehouseId, model.Amount, model.ItemName);
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
            if (!UserHasPermission(item.WarehouseId, Permissionlevel.Admin)) return Unauthorized();

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
        public IActionResult PatchItem(int id, [FromBody] ItemPatchDTO model)
        {
            if (CurrentUser == null) return Unauthorized();

            Item? item = _context.Items.Find(id);
            if (item == null) return NotFound();
            if (!UserHasPermission(item.WarehouseId, Permissionlevel.Editor)) return Unauthorized();
            if (model.isEmpty()) return BadRequest("No properties to PATCH provided");

            try
            {
                if (model.ItemName != null) item.ItemName = model.ItemName;
                _context.Items.Update(item);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error patching warehouse");
            }
            return Ok();
        }

        [HttpGet("{id}")]
        public IActionResult GetItem(int id)
        {

            if (CurrentUser == null) return Unauthorized();

            Item? item = _context.Items.Find(id);
            if (item == null) return NotFound();
            if (!UserHasPermission(item.WarehouseId, Permissionlevel.Viewer)) return Unauthorized();

            return Ok(new ItemGetDTO(item));
        }


    }
}
