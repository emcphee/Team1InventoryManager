import WarehouseList from "./WarehouseList";
import WarehouseNewSubmit from "./WarehouseNewSubmit";
import './css/Warehouse.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function Warehouse() {
    const { warehouseId } = useParams();
    const [warehouseList, setWarehouseList] = useState([]);
    const [permissionLevel, setPermissionLevel] = useState(null); //Permission level

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

    useEffect(() => {
        const fetchWarehousePermissionLevel = async (warehouseId) => {
            try {
                const response = await fetch(`https://localhost:7271/api/Warehouse/${warehouseId}`, {
                    method: 'GET',
                    credentials: 'include' // Include cookies if needed
                });
                
                if (response.ok) {
                    const warehouseData = await response.json();
                    setPermissionLevel(warehouseData.permissionLevel);
                } else {
                    console.error('Failed to fetch warehouse data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching warehouse data:', error);
            }
        };
        fetchWarehousePermissionLevel(warehouseId);
    }, [warehouseId]);
    
    return (
        <div className = "warehouse">
            <h1 className="warehouse-h1">Warehouses</h1>
            <WarehouseList warehouseList={warehouseList} fetchWarehouses={fetchWarehouses} />
            <div style={{height:'20px'}}></div>
            {permissionLevel === 1 && (
            <WarehouseNewSubmit onAddWarehouse={handleAddWarehouse} />
            )}
        </div>
    );
}

export default Warehouse;