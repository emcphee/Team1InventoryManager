import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import './css/Users.css';

function Users() {

    const navigate = useNavigate();
    const { warehouseId } = useParams();
    const [usersList, setUsersList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editUsers, setEditUsers] = useState({ userId: 0, username: '', permission: ''});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`https://localhost:7271/api/UserPermission/${warehouseId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsersList(data);
                } else {
                    throw response;
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [warehouseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUsers((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    }

    const handleItemClick = (warehouseId) => {
        navigate(`/warehouses/items/${warehouseId}`);
    }

    const handleLogsClick = (warehouseId) => {
        navigate(`/warehouses/logs/${warehouseId}`);
    };

    return (
        <>
        <button className="users" onClick={() => handleItemClick(warehouseId)}>Items</button>
        <button className="users" onClick={() => handleLogsClick(warehouseId)}>Logs</button>
        <Table bordered hover responsive className='fixed-table'>
            <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Permission</th>
            </tr>
            </thead>
            <tbody>
                {usersList.map((user, index) => (
                    <tr key={index}>
                        {editIndex === index ? (
                            <>
                                <td>
                                    <input type="text" name="username" value={editUsers.userId} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="itemName" value={editUsers.username} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="number" name="amount" value={editUsers.permission} onChange={handleChange} />
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{user.userId}</td>
                                <td>{user.username}</td>
                                <td>{user.permission}</td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );

}

export default Users;

