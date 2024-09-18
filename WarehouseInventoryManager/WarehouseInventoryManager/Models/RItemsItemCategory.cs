using System;
using System.Collections.Generic;

namespace WarehouseInventoryManager.Models;

public partial class RItemsItemCategory
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public int ItemId { get; set; }

    public virtual ItemCategory Category { get; set; } = null!;

    public virtual Item Item { get; set; } = null!;
}
