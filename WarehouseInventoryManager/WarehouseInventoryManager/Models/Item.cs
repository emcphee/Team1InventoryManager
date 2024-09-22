using System;
using System.Collections.Generic;

namespace WarehouseInventoryManager.Models;

public partial class Item
{
    public int ItemId { get; set; }

    public string ItemName { get; set; } = null!;

    public int Amount { get; set; }

    public int WarehouseId { get; set; }

    public virtual ICollection<Log> Logs { get; set; } = new List<Log>();

    public virtual ICollection<RItemsItemCategory> RItemsItemCategories { get; set; } = new List<RItemsItemCategory>();

    public virtual Warehouse Warehouse { get; set; } = null!;
}
