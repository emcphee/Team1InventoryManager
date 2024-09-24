import React, { useState, useEffect } from 'react';
import './css/InvLog.css';
import Table from 'react-bootstrap/Table';

 function InventoryLog() {
    
    const [logList, setLogList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editLog, setEditLog] = useState({ username: "", itemName: "", amount: 0, date: null});

    const fetchLogs = async () => {
        try {
            const response = await fetch('https://localhost:7271/api/Logs/', {
                method: 'GET',
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json();
                setLogList(data.logList);
            } else {
                throw response;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditLog((prevLog) => ({
            ...prevLog,
            [name]: value
        }));
    }

    return (
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
                                    <input type="text" name="logid" value={editLog.username} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="itemid" value={editLog.itemName} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="number" name="amount" value={editLog.amount} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="warehouseid" value={editLog.date} onChange={handleChange} />
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{log.username}</td>
                                <td>{log.itemName}</td>
                                <td>{log.amount}</td>
                                <td>{log.date}</td>
                            </>
                        )}
                    </tr>
                ))}
          </tbody>
        </Table>
    );
}

export default InventoryLog;
