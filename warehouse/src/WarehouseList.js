import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import WarehouseButtons from './WarehouseButtons';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function WarehouseList({ warehouseList, fetchWarehouses }) {

    const [editWarehouseId, setEditWarehouseId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });

    const navigate = useNavigate();

    const handleItemClick = (warehouseId) => {
        // only navigate if not in edit mode
        if (editWarehouseId === null){
            navigate(`/warehouses/items/${warehouseId}`);
        }
    }

    const handleLogsClick = (warehouseId) => {
        if (editWarehouseId === null){
            navigate(`/warehouses/logs/${warehouseId}`);
        }
    };
    
    const handleEditClick = (warehouse) => {
        setEditWarehouseId(warehouse.warehouseId);
        setFormData({
            name: warehouse.name,
            address: warehouse.address
        });
    }

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleSaveClick = async (warehouseId) => {
        try {
            const response = await fetch(`https://localhost:7271/api/Warehouse/${warehouseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address
                }),
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
        finally {
            setEditWarehouseId(null);
        }
    }

    const handleDeleteClick = async (warehouse) => {
        try {
            const response = await fetch(`https://localhost:7271/api/Warehouse/${warehouse.warehouseId}`, {
                method: 'DELETE',
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

    const handleCancelClick = () => {
        setEditWarehouseId(null);
    }

    return (
        <>
            <ListGroup variant='flush'>
                {warehouseList.map((warehouse) => (
                    <ListGroup.Item 
                        className='warehouse-list-group'
                         key={warehouse.warehouseId} 
                    >
                        <div>
                            {editWarehouseId === warehouse.warehouseId ? (
                                <Form>
                                    <Form.Group controlId="formWarehouseName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group controlId="formWarehouseAddress">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} />
                                    </Form.Group>

                                    <Button variant='primary' onClick={() => handleSaveClick(warehouse.warehouseId)}>Save</Button>
                                    <Button variant='secondary' onClick={handleCancelClick}>Cancel</Button>
                                </Form>
                            ) : (
                                <div className='warehouse-name-address'>
                                    <div><strong>{warehouse.name}</strong></div>
                                    <div>{warehouse.address}</div>
                                </div>
                            )}
                            <button onClick={() => handleItemClick(warehouse.warehouseId)}>Items</button>
                            <button onClick={() => handleLogsClick(warehouse.warehouseId)}>Logs</button>
                        </div>
                        <WarehouseButtons onEditClick={() => handleEditClick(warehouse)} onDeleteClick={() => handleDeleteClick(warehouse)} />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

export default WarehouseList;