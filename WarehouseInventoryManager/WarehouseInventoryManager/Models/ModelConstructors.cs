namespace WarehouseInventoryManager.Models
{
    public partial class User 
    {
        public User(string username, byte[] passwordHash, byte[] salt)
        {
            this.Username = username;
            this.PasswordHash = passwordHash;
            this.Salt = salt;
        }
    }

    public partial class Warehouse
    {
        public Warehouse(string name, string address)
        {
            this.Name = name;
            this.Address = address;
        }
    }
    public partial class UserPermission
    {
        public UserPermission(int userId, int warehouseId, int permission)
        {
            this.UserId = userId;
            this.WarehouseId = warehouseId;
            this.Permission = permission;
        }
    }
    
}
