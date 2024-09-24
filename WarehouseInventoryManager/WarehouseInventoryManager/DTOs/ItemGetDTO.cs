using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.DTOs
{
    public class ItemGetDTO
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }

        public int Amount { get; set; }
        public List<string> Categories { get; set; }
        public ItemGetDTO(Item item, List<string> categories)
        {

            ItemId = item.ItemId;
            ItemName = item.ItemName;
            Amount = item.Amount;
            Categories = categories;
        }
    }
}
