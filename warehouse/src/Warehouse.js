import WarehouseList from "./WarehouseList";
import WarehouseNewSubmit from "./WarehouseNewSubmit";
import './css/Warehouse.css';
import { useState, useEffect } from "react";

function Warehouse() {
    const [warehouseList, setWarehouseList] = useState([]);

    const fetchWarehouses = async () => {
        try {
            const response = await fetch('https://localhost:7271/api/Warehouse/list', {
                method: 'GET',
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json();
                setWarehouseList(data.warehouseList);
            } else {
                throw response;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleAddWarehouse = async (warehouse) => {
        try {
            const response = await fetch('https://localhost:7271/api/Warehouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(warehouse),
                credentials: 'include'
            });

            if (!response.ok) {
                throw response;
            }
            await fetchWarehouses();
        }
        catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div>
            <h1 className="warehouse-h1">List of Warehouses</h1>
            <WarehouseList warehouseList={warehouseList} fetchWarehouses={fetchWarehouses} />
            <WarehouseNewSubmit onAddWarehouse={handleAddWarehouse} />
        </div>
    );
}

export default Warehouse;