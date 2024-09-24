import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';

function WarehouseList() {

    const [warehouseList, setWarehouseList] = useState([]);

    const navigate = useNavigate();

    const handleItemClick = (warehouseId) => {
        navigate(`/warehouses/${warehouseId}/categories`);
    }

    const handleLogsClick = (warehouseId) => {
        navigate(`/warehouses/logs/${warehouseId}`);
    };
    
    useEffect(() => {
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
        fetchWarehouses();
    }, []);

    return (
        <>
            <ListGroup variant='flush'>
                {warehouseList.map((warehouse, index) => (
                    <ListGroup.Item key={index}>
                        <div><strong>{warehouse.name}</strong></div>
                        <div>{warehouse.address}</div>
                        <button onClick={() => handleItemClick(index+1)}>Items</button>
                        <button onClick={() => handleLogsClick(warehouse.warehouseId)}>Logs</button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

export default WarehouseList;