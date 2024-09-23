import WarehouseList from "./WarehouseList";
import WarehouseHeading from "./WarehouseHeading";
import './css/Warehouse.css';

function Warehouse() {
    return (
        <div>
            <WarehouseHeading />
            <WarehouseList />
        </div>
    );
}

export default Warehouse;