using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class InventoryManagerBaseController : ControllerBase
    {

        protected readonly WarehouseInventoryManagementDbContext _context;
        public InventoryManagerBaseController(WarehouseInventoryManagementDbContext context)
        {
            _context = context;
        }

        protected User? CurrentUser
        {
            get
            {
                Claim? userIDClaim = User.FindFirst("UserId");
                if (userIDClaim == null) return null;

                if (!int.TryParse(userIDClaim.Value, out int userID)) return null;

                return _context.Users.Find(userID);
            }
        }

        protected enum Permissionlevel
        {
            Admin = 1,
            Editor = 2,
            Viewer = 3
        }

        protected bool UserHasPermission(int warehouseId, Permissionlevel requiredPermissionLevel)
        {
            if (CurrentUser == null) return false;

            UserPermission? permission = _context.UserPermissions.Where(perm => perm.UserId == CurrentUser.UserId && perm.WarehouseId == warehouseId).FirstOrDefault();
            
            if (permission == null) return false;

            return (Permissionlevel)permission.Permission <= requiredPermissionLevel;
        }
    }
}
