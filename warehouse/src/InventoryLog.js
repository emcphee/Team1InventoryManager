import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/InvLog.css';
import Table from 'react-bootstrap/Table';

 function InventoryLog() {
    
    const { warehouseId } = useParams();
    const [logList, setLogList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editLog, setEditLog] = useState({ username: '', itemName: '', amount: 0, movementDate: null});

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(`https://localhost:7271/api/Logs/${warehouseId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setLogList(data);
                } else {
                    throw response;
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchLogs();
    }, [warehouseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditLog((prevLog) => ({
            ...prevLog,
            [name]: value
        }));
    }

    const navigate = useNavigate();

    const handleItemClick = (warehouseId) => {
        navigate(`/warehouses/items/${warehouseId}`);
    }

    return (
        <>
        <button className="items" onClick={() => handleItemClick(warehouseId)}>Items</button>
        <Table bordered hover responsive className='fixed-table'>
            <thead>
            <tr>
              <th>Username</th>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Movement Date</th>
            </tr>
            </thead>
            <tbody>
                {logList.map((log, index) => (
                    <tr key={index}>
                        {editIndex === index ? (
                            <>
                                <td>
                                    <input type="text" name="username" value={editLog.username} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="itemName" value={editLog.itemName} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="number" name="amount" value={editLog.amount} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="movementDate" value={editLog.movementDate} onChange={handleChange} />
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{log.username}</td>
                                <td>{log.itemName}</td>
                                <td>{log.amount}</td>
                                <td>{new Date(log.movementDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} at {new Date(log.movementDate).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</td>
                            </>
                        )}
                    </tr>
                ))}
          </tbody>
        </Table>
        </>
    );
}

export default InventoryLog;
