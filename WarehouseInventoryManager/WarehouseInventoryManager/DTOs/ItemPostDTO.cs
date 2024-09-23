namespace WarehouseInventoryManager.DTOs
{
    public class ItemPostDTO 
    {
        public string ItemName { get; set; }

        public int Amount { get; set; }

        public int WarehouseId { get; set; }
    }
}
