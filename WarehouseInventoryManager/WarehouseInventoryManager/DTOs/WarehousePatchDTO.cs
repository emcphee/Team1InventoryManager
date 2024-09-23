namespace WarehouseInventoryManager.DTOs
{
    public class WarehousePatchDTO
    {
        public string? Name { get; set; }
        public string? Address { get; set; }

        public bool isEmpty()
        {
            return Name == null && Address == null;
        }
    }
}
