using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPermissionController : InventoryManagerBaseController
    {
        public UserPermissionController(WarehouseInventoryDbContext context) : base(context)
        {
        }

        [HttpPut("{warehouseId}/{userId}/{permissionLevel}")]
        public IActionResult AddPermission(int warehouseId, int userId, int permissionLevel)
        {
            if(!UserHasPermission(warehouseId, Permissionlevel.Admin)) return Unauthorized();
            if (permissionLevel > 3 || permissionLevel < 1) return BadRequest("Invalid permission level");
            try
            {
                UserPermission? permission = _context.UserPermissions.FirstOrDefault(perm => perm.WarehouseId == warehouseId && perm.UserId == userId);
                if (permission != null)
                {
                    permission.Permission = permissionLevel;
                    _context.UserPermissions.Update(permission);
                }
                else
                {
                    permission = new UserPermission(userId, warehouseId, permissionLevel);
                    _context.UserPermissions.Add(permission);
                }
                _context.SaveChanges();

            }
            catch
            {
                return StatusCode(500, "Unknown error editing user permission");
            }

            return Ok();
        }

        [HttpDelete("{warehouseId}/{userId}")]
        public IActionResult RemovePermission(int warehouseId, int userId)
        {
            if(!UserHasPermission(warehouseId, Permissionlevel.Admin)) return Unauthorized();
            try
            {
                UserPermission? permission = _context.UserPermissions.FirstOrDefault(perm => perm.WarehouseId == warehouseId && perm.UserId == userId);
                if (permission != null)
                {
                    _context.UserPermissions.Remove(permission);
                }
                else
                {
                    return BadRequest("User doesn't have permission");
                }
                _context.SaveChanges();

            }
            catch
            {
                return StatusCode(500, "Unknown error deleting user permission");
            }

            return Ok();
            
        }

        [HttpGet("{warehouseId}")]
        public IActionResult GetPermissions(int warehouseId)
        {
            if(!UserHasPermission(warehouseId, Permissionlevel.Viewer)) return Unauthorized();

            return Ok((from perm in _context.UserPermissions
            join user in _context.Users on perm.UserId equals user.UserId
            where perm.WarehouseId == warehouseId
            select new 
            {
                user.UserId,
                user.Username,
                perm.Permission
            }).ToList());
        }
    }
}
