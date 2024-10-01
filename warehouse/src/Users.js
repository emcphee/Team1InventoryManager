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
    const [permissionLevel, setPermissionLevel] = useState(null); //Permission level
    const [currentUsername, setCurrentUsername] = useState('');
    const [isAddUserFormVisible, setAddUserFormVisible] = useState(false);
    const [newUserId, setNewUserId] = useState('');
    const [newUserPermission, setNewUserPermission] = useState(3);

    useEffect(() => {
        fetchWarehousePermissionLevel(warehouseId);
        fetchUsers();
        fetchCurrentUser(); // Fetch the logged-in user's username
    }, [warehouseId]);

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

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`https://localhost:7271/api/UserAccount/check`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUsername(data.username);
            } else {
                console.error('Error fetching current user:', response.statusText);
            }
        } catch (error) {
            console.log('Error fetching current user:', error);
        }
    };

    const handlePermissionChange = async (userId, newPermissionLevel) => {
        try {
            const response = await fetch(`https://localhost:7271/api/UserPermission/${warehouseId}/${userId}/${newPermissionLevel}`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (response.ok) {
                console.log(`Permission updated successfully for user ${userId}`);
                await fetchUsers(); // Refresh the users list
                setEditIndex(null);
            } else {
                console.error('Failed to update permission:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            const response = await fetch(`https://localhost:7271/api/UserPermission/${warehouseId}/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                console.log(`User ${userId} removed successfully`);
                await fetchUsers(); // Refresh the users list
            } else {
                console.error('Failed to remove user:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch(`https://localhost:7271/api/UserPermission/${warehouseId}/${newUserId}/${newUserPermission}`, {
                method: 'PUT',
                credentials: 'include'
            });
    
            if (response.ok) {
                console.log(`User ${newUserId} added successfully`);
                await fetchUsers();
                setNewUserId('');
                setNewUserPermission(3);
                setAddUserFormVisible(false);
            } else {
                console.error('Failed to add user:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleItemClick = (warehouseId) => {
        navigate(`/warehouses/items/${warehouseId}`);
    }

    const handleLogsClick = (warehouseId) => {
        navigate(`/warehouses/logs/${warehouseId}`);
    };
    
    const permissionToName = (permissionLevel) => {
            if(permissionLevel == 1) return 'Admin';
            if(permissionLevel == 2) return 'Editor';
            return 'Viewer';
    }

    return (
        <>
        <button className="items" onClick={() => handleItemClick(warehouseId)}>Items</button>
        <button className="items" onClick={() => handleLogsClick(warehouseId)}>Logs</button>
        <Table bordered hover responsive className='fixed-table' id="user-table">
            <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Permission</th>
              {permissionLevel === 1 && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {usersList.map((user, index) => (
                        <tr key={index}>
                            <td>{user.userId}</td>
                            <td>{user.username}</td>
                            <td>
                                {editIndex === index ? (
                                    <select
                                        value={editUsers.permission}
                                        onChange={(e) =>
                                            setEditUsers({ ...editUsers, permission: e.target.value })
                                        }
                                    >
                                        <option value="1">Admin</option>
                                        <option value="2">Editor</option>
                                        <option value="3">Viewer</option>
                                    </select>
                                ) : (
                                    permissionToName(user.permission)
                                )}
                            </td>
                            {permissionLevel === 1 && (
                                <td>
                                    {user.username === currentUsername ? (
                                        <span>This Is You</span>
                                    ) : (
                                        <>
                                            {editIndex === index ? (
                                                <>
                                                    {/* Save Button */}
                                                    <button
                                                        onClick={() => {
                                                            handlePermissionChange(user.userId, editUsers.permission);
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    {/* Cancel Button */}
                                                    <button
                                                        onClick={() => setEditIndex(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => {
                                                            setEditIndex(index);
                                                            setEditUsers({
                                                                userId: user.userId,
                                                                username: user.username,
                                                                permission: user.permission
                                                            });
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Delete User Button */}
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to remove ${user.username} from this warehouse?`)) {
                                                                handleRemoveUser(user.userId);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
            </tbody>
        </Table>
        <div style={{margin: '0 auto'}}>
            <button className="items" onClick={() => setAddUserFormVisible((prev) => !prev)}>
                {isAddUserFormVisible ? 'Cancel' : 'Add User'}
            </button>
            {isAddUserFormVisible && (
                <div>
                    <input
                        type="text"
                        placeholder="User ID"
                        value={newUserId}
                        onChange={(e) => setNewUserId(e.target.value)}
                    />
                    <select
                        value={newUserPermission}
                        onChange={(e) => setNewUserPermission(Number(e.target.value))}
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>Editor</option>
                        <option value={3}>Viewer</option>
                    </select>
                    <button onClick={handleAddUser}>Add User</button>
                    <button onClick={() => setAddUserFormVisible(false)}>Cancel</button>
                </div>
            )}
        </div>
        </>
    );

}

export default Users;

