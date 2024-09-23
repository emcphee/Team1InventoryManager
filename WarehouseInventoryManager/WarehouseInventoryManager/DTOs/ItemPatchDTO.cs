namespace WarehouseInventoryManager.DTOs
{
    public class ItemPatchDTO 
    {
        public string? ItemName { get; set; }

        public bool isEmpty() 
        {
            return ItemName == null;
        }
    }
}
