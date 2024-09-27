using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            Item? item;
            try
            {
                if (_context.Items.FirstOrDefault(item => model.WarehouseId == item.WarehouseId && model.ItemName == item.ItemName) != null) return BadRequest("Item already exists with that name");
                item = new Item(model.WarehouseId, model.Amount, model.ItemName);
                _context.Items.Add(item);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error adding item");
            }
            return Ok(new { ItemId = item.ItemId });
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
                _context.Database.ExecuteSql($"DELETE FROM R_Items_ItemCategories WHERE ItemID = {item.ItemId};");
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

            return Ok(new ItemGetDTO(item, DBUtils.GetCategories(_context, item)));
        }

        [HttpPost("applyCategory/{itemId}/{categoryName}")]
        public IActionResult AddCategory(int itemId, string categoryName)
        {
            Item? item = _context.Items.Find(itemId);
            if (item == null) return NotFound();
            if (!UserHasPermission(item.WarehouseId, Permissionlevel.Editor)) return Unauthorized();

            ItemCategory? category = _context.ItemCategories.FirstOrDefault(cat => cat.WarehouseId == item.WarehouseId && cat.CategoryName == categoryName);
            if (category == null) return NotFound("Category not found");
            if (_context.RItemsItemCategories.FirstOrDefault(R => R.CategoryId == category.CategoryId && R.ItemId == item.ItemId) != null) return BadRequest("Item already has category"); 
            try
            {
                RItemsItemCategory rItemsItemCategory = new RItemsItemCategory() { CategoryId = category.CategoryId, ItemId = item.ItemId };
                _context.RItemsItemCategories.Add(rItemsItemCategory);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Unknown error applying category");
            }

            
            return Ok();
        }

        [HttpDelete("unapplyCategory/{itemId}/{categoryName}")]
        public IActionResult RemoveCategory(int itemId, string categoryName)
        {
            Item? item = _context.Items.Find(itemId);
            if (item == null) return NotFound();
            if (!UserHasPermission(item.WarehouseId, Permissionlevel.Editor)) return Unauthorized();

            ItemCategory? category = _context.ItemCategories.FirstOrDefault(cat => cat.WarehouseId == item.WarehouseId && cat.CategoryName == categoryName);
            if (category == null) return NotFound("Category not found");

            try
            {
                RItemsItemCategory? rItemsItemCategory = _context.RItemsItemCategories.FirstOrDefault(R => R.CategoryId == category.CategoryId && R.ItemId == item.ItemId); 
                if (rItemsItemCategory == null) return NotFound("Item doesn't have category");
                _context.RItemsItemCategories.Remove(rItemsItemCategory);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Unknown error applying category");
            }
            return Ok();
        }

        [HttpPost("category/{warehouseId}/{categoryName}")]
        public IActionResult CreateCategory(int warehouseId, string categoryName)
        {
            if (!UserHasPermission(warehouseId, Permissionlevel.Editor)) return Unauthorized();

            ItemCategory? category = _context.ItemCategories.FirstOrDefault(cat => cat.WarehouseId == warehouseId && cat.CategoryName == categoryName);
            if (category != null) return BadRequest("Category already exists");
            try
            {
                _context.ItemCategories.Add(new ItemCategory() { CategoryName = categoryName, WarehouseId = warehouseId});
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Unknown error creating category");
            }

            return Ok();
        }


        [HttpDelete("category/{warehouseId}/{categoryName}")]
        public IActionResult DeleteCategory(int warehouseId, string categoryName)
        {
            if (!UserHasPermission(warehouseId, Permissionlevel.Editor)) return Unauthorized();

            ItemCategory? category = _context.ItemCategories.FirstOrDefault(cat => cat.WarehouseId == warehouseId && cat.CategoryName == categoryName);
            if (category == null) return NotFound();
            try
            {
                _context.Database.ExecuteSql($"DELETE FROM R_Items_ItemCategories WHERE CategoryID = {category.CategoryId};");
                _context.ItemCategories.Remove(category);
                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Unknown error deleting category");
            }

            return Ok();
        }

        [HttpGet("category")]
        public IActionResult GetCategories(int warehouseId)
        {
            if (!UserHasPermission(warehouseId, Permissionlevel.Viewer)) return Unauthorized();
            var categoryNames = _context.ItemCategories
            .Where(ic => ic.WarehouseId == warehouseId)
            .Select(ic => ic.CategoryName)
            .ToList();
            return Ok(categoryNames);
        }


        
    }
}
