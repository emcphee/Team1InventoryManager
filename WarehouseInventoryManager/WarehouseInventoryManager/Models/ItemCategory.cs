using System;
using System.Collections.Generic;

namespace WarehouseInventoryManager.Models;

public partial class ItemCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public int WarehouseId { get; set; }

    public virtual ICollection<RItemsItemCategory> RItemsItemCategories { get; set; } = new List<RItemsItemCategory>();

    public virtual Warehouse Warehouse { get; set; } = null!;
}
