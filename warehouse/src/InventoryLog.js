import React, { useState } from 'react';
import './css/InvLog.css';
import Table from 'react-bootstrap/Table';

 function InventoryLog() {
    
    const [logList, setLogList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editLog, setEditLog] = useState({ logId: null, itemId: null, amount: 0, warehouseId: null, date: null, userId: null });

    // const handleEdit = (index) => {
    //     setEditIndex(index);
    //     setEditItem(logList[index]);
    // }

    // const handleConfirm = (index) => {
    //     const updatedLogs = [...logList];
    //     updatedLogs[index] = editLog;
    //     setLogList(updatedItems);
    //     setEditIndex(null);
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditLog((prevLog) => ({
    //         ...prevLog,
    //         [name]: value
    //     }));
    // }

    // const handleDelete = (index) => {
    //     console.log('delete', index);
    // }


    return (
        <Table bordered hover responsive className='fixed-table'>
            <thead>
            <tr>
              <th>Log ID</th>
              <th>Item ID</th>
              <th>Amount</th>
              <th>Warehouse ID</th>
              <th>Movement Date</th>
              <th>User ID</th>
            </tr>
            </thead>
            <tbody>
                {logList.map((log, index) => (
                    <tr key={index}>
                        {editIndex === index ? (
                            <>
                                <td>
                                    <input type="text" name="logid" value={editLog.logId} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="itemid" value={editLog.itemId} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="number" name="amount" value={editLog.amount} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="warehouseid" value={editLog.warehouseId} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="userid" value={editLog.userId} onChange={handleChange} />
                                </td>
                                {/* <td>
                                    <button onClick={() => handleConfirm(index)}>Confirm</button>
                                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                </td> */}
                            </>
                        ) : (
                            <>
                                <td>{log.logId}</td>
                                <td>{log.itemId}</td>
                                <td>{log.amount}</td>
                                <td>{log.warehouseId}</td>
                                <td>{log.userId}</td>
                                {/* {userType === 'admin' && (
                                    <td>
                                        <button onClick={() => handleEdit(index)}>Edit</button>
                                        <button onClick={() => handleDelete(index)}>Delete</button>
                                    </td>
                                )} */}
                            </>
                        )}
                    </tr>
                ))}
          </tbody>
        </Table>
    );
}

export default InventoryLog;
