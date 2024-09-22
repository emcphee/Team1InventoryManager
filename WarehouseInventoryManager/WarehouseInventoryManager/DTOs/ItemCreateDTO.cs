namespace WarehouseInventoryManager.DTOs
{
    public class ItemCreateDTO 
    {
        public string? ItemName { get; set; }

        public int? Amount { get; set; }

        public int? WarehouseId { get; set; }
    }
}
