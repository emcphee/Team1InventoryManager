using WarehouseInventoryManager.Models;

namespace WarehouseInventoryManager.DTOs
{
    public class WarehouseGetWithItemsDTO 
    {
        public int WarehouseId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int PermissionLevel { get; set; }

        public List<ItemGetDTO> Items { get; set; }

        public WarehouseGetWithItemsDTO(List<Item> items, Warehouse warehouse, UserPermission permission, WarehouseInventoryDbContext dbContext)
        {
            this.WarehouseId = warehouse.WarehouseId;
            this.Name = warehouse.Name;
            this.Address = warehouse.Address;
            this.PermissionLevel = permission.Permission;

            Items = new List<ItemGetDTO>();
            foreach (var item in items)
            {
                Items.Add(new ItemGetDTO(item, DBUtils.GetCategories(dbContext, item)));
            }
        }

    }
}
