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
    }
}
