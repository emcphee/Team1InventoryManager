namespace WarehouseInventoryManager.DTOs
{
    public class WarehouseListDTO
    {
        public WarehouseListDTO() { }
        public WarehouseListDTO(List<WarehouseGetDTO> list)
        {
            WarehouseList = list;
        }
        public List<WarehouseGetDTO> WarehouseList { get; set; }
    }
}
