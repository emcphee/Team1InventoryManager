import WarehouseList from "./WarehouseList";
import WarehouseNewSubmit from "./WarehouseNewSubmit";
import './css/Warehouse.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function Warehouse() {
    const { warehouseId } = useParams();
    const [warehouseList, setWarehouseList] = useState([]);
    const [permissionLevel, setPermissionLevel] = useState(null); //Permission level
    const [isLoading, setIsLoading] = useState(true); // Track loading state

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
        const fetchPermissionLevel = async () => {
            try {
                const response = await fetch('https://localhost:7271/api/Warehouse/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    // Assuming all warehouses have the same permission level, extract it from one warehouse
                    if (data.warehouseList.length > 0) {
                        setPermissionLevel(data.warehouseList[0].permissionLevel);
                    }
                } else {
                    console.error('Error fetching permission level:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching permission level:', error);
            } finally {
                setIsLoading(false); // Stop loading when request is complete
            }
        };
        fetchPermissionLevel();
    }, []);
    
    return (
        <div className = "warehouse">
            <h1 className="warehouse-h1">Warehouses</h1>
            <WarehouseList warehouseList={warehouseList} fetchWarehouses={fetchWarehouses} />
            <div style={{height:'20px'}}></div>
            {permissionLevel == 1 && (
                <WarehouseNewSubmit onAddWarehouse={handleAddWarehouse} />
            )}
        </div>
    );
}

export default Warehouse;