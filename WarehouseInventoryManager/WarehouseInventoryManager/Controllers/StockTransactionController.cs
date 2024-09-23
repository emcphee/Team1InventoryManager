using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseInventoryManager.DTOs;
using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockTransactionController : InventoryManagerBaseController
    {
        public StockTransactionController(WarehouseInventoryDbContext context) : base(context)
        {
        }

        [HttpPost]
        public IActionResult StockTransaction([FromBody] StockTransactionDTO model)
        { 
            if (CurrentUser == null) return Unauthorized();

            Item? item = _context.Items.Find(model.ItemID);
            if (item == null) return NotFound();

            Warehouse? warehouse = _context.Warehouses.Find(item.WarehouseId);
            if (warehouse == null) return NotFound(); 

            if (!UserHasPermission(warehouse.WarehouseId, Permissionlevel.Editor)) return Unauthorized();

            if (model.Amount == 0) return BadRequest("Invalid transaction amount");

            try
            {
                item.Amount += model.Amount;
                _context.Items.Update(item);

                Log newLog = new Log() { Amount = model.Amount, ItemId = item.ItemId, WarehouseId = warehouse.WarehouseId, UserId = CurrentUser.UserId};
                _context.Logs.Add(newLog);

                _context.SaveChanges();
            }
            catch
            {
                return StatusCode(500, "Error making stock transaction");
            }
            return Ok();
        }
    }
} 