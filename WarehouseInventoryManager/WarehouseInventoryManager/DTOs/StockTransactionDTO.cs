namespace WarehouseInventoryManager.DTOs
{
    public class StockTransactionDTO
    {
        public required int ItemID { get; set; }

        public required int Amount { get; set; }
    }
}
