namespace WarehouseInventoryManager.Models
{
    public class DBUtils
    {
        public static List<string> GetCategories(WarehouseInventoryDbContext dbContext, Item item)
        {

            return (from r in dbContext.RItemsItemCategories
             join ic in dbContext.ItemCategories on r.CategoryId equals ic.CategoryId
             where r.ItemId == item.ItemId
             select ic.CategoryName)
            .ToList();
        }
    }
}
