namespace WarehouseInventoryManager.DTOs
{
    public class LogDTO
    {
        public string Username { get; set; }
        public string ItemName { get; set; }
        public int Amount { get; set; }
        public DateTime MovementDate { get; set; }
    }
}
