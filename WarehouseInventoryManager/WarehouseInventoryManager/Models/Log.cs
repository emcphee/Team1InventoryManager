using System;
using System.Collections.Generic;

namespace WarehouseInventoryManager.Models;

public partial class Log
{
    public int LogId { get; set; }

    public int ItemId { get; set; }

    public int Amount { get; set; }

    public int WarehouseId { get; set; }

    public DateTime? MovementDate { get; set; }

    public int? UserId { get; set; }

    public virtual Item Item { get; set; } = null!;

    public virtual User? User { get; set; }
}
