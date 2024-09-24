import WarehouseList from "./WarehouseList";
import './css/Warehouse.css';

function Warehouse() {
    return (
        <div>
            <h1 className="warehouse-h1">List of Warehouses</h1>
            <WarehouseList />
        </div>
    );
}

export default Warehouse;