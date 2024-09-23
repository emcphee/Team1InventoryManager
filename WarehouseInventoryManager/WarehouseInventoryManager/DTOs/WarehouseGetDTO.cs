namespace WarehouseInventoryManager.DTOs
{
    public class WarehouseGetDTO 
    {
        public required int WarehouseId { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required int PermissionLevel { get; set; }
    }
}
