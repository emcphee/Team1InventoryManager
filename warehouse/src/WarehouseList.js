import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate, useParams } from 'react-router-dom';
import WarehouseButtons from './WarehouseButtons';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './css/WarehouseList.css';

function WarehouseList({ warehouseList, fetchWarehouses }) {

    const { warehouseId } = useParams();
    const [permissionLevel, setPermissionLevel] = useState(null); //Permission level
    const [isLoading, setIsLoading] = useState(true); // Track loading state
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

    const handleUsersClick = (warehouseId) => {
        if (editWarehouseId === null){
            navigate(`/warehouses/users/${warehouseId}`);
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
        <>
            <ListGroup variant='flush'>
                {warehouseList.map((warehouse) => (
                    <ListGroup.Item 
                        className='warehouse-list-group'
                         key={warehouse.warehouseId} 
                    >
                        <div style={{width: '60%'}}>
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
                            <Button style={{width: '30%'}} variant='primary' onClick={(event) => handleItemClick(warehouse.warehouseId) }>Open</Button>
                        </div>
                        {permissionLevel === 1 && (
                            <WarehouseButtons onEditClick={() => handleEditClick(warehouse)} onDeleteClick={() => handleDeleteClick(warehouse)} />
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

export default WarehouseList;