import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';

function WarehouseList() {

    const navigate = useNavigate();

    const handleItemClick = (warehouseId) => {
        navigate(`/warehouses/${warehouseId}/categories`);
    }

    const warehouseList = [
        {
            name: 'Warehouse 1',
            address: '123 Warehouse Lane',
        },
        {
            name: 'Warehouse 2',
            address: '456 Warehouse Lane',
        },
        {
            name: 'Warehouse 3',
            address: '789 Warehouse Lane',
        },
        {
            name: 'Warehouse 4',
            address: '101112 Warehouse Lane',
        },
        {
            name: 'Warehouse 5',
            address: '131415 Warehouse Lane',
        }
    ];

    return (
        <>
            <ListGroup variant='flush'>
                {warehouseList.map((warehouse, index) => (
                    <ListGroup.Item key={index} action onClick={() => handleItemClick(index+1)}>
                        <div><strong>{warehouse.name}</strong></div>
                        <div>{warehouse.address}</div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

export default WarehouseList;