namespace WarehouseInventoryManager.DTOs
{
    public class WarehouseDTO 
    {
        public required int WarehouseId { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required int PermissionLevel { get; set; }
    }
}
