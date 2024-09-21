namespace WarehouseInventoryManager.DTOs
{
    public class WarehouseListDTO
    {
        public WarehouseListDTO() { }
        public WarehouseListDTO(List<WarehouseDTO> list)
        {
            WarehouseList = list;
        }
        public List<WarehouseDTO> WarehouseList { get; set; }
    }
}
