using System;
using System.Collections.Generic;

namespace WarehouseInventoryManager.Models;

public partial class UserPermission
{
    public int UserId { get; set; }

    public int WarehouseId { get; set; }

    public int? Permission { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
