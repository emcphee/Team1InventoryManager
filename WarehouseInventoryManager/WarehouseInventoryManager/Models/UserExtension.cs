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
}
