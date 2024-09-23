import Table from 'react-bootstrap/Table';
import './css/Items.css';
import { useState } from 'react';

function Items() {

    const userType = 'admin';

    const [itemsList, setItemsList] = useState([
        { id: 1, name: 'Item 1', amount: 100, category: 'Category 1' },
        { id: 2, name: 'Item 2', amount: 200, category: 'Category 2' },
        { id: 3, name: 'Item 3', amount: 300, category: 'Category 3' },
        { id: 4, name: 'Item 4', amount: 400, category: 'Category 4' },
        { id: 5, name: 'Item 5', amount: 500, category: 'Category 2' },
        { id: 6, name: 'Item 6', amount: 600, category: 'Category 1' },
        { id: 7, name: 'Item 7', amount: 800, category: 'Category 3' },
        { id: 8, name: 'Item 8', amount: 800, category: 'Category 2' },
        { id: 9, name: 'Item 9', amount: 900, category: 'Category 1' },
        { id: 10, name: 'Item 10', amount: 1000, category: 'Category 4' },
    ]);
    
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingItem, setEditingItem] = useState({ id: null, name: '', amount: 0, category: '' });

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditingItem(itemsList[index]);
    }

    const handleConfirm = (index) => {
        const updatedItems = [...itemsList];
        updatedItems[index] = editingItem;
        setItemsList(updatedItems);
        setEditingIndex(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingItem((prevItem) => ({
            ...prevItem,
            [name]: value
        }));
    }

    const handleDelete = (index) => {
        console.log('delete', index);
    }

    return (
        <Table bordered hover responsive className='fixed-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              {userType === 'admin' && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
                {itemsList.map((item, index) => (
                    <tr key={index}>
                        {editingIndex === index ? (
                            <>
                                <td>
                                    <input type="text" name="id" value={editingItem.id} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="name" value={editingItem.name} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="number" name="amount" value={editingItem.amount} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="text" name="category" value={editingItem.category} onChange={handleChange} />
                                </td>
                                <td>
                                    <button onClick={() => handleConfirm(index)}>Confirm</button>
                                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                                <td>{item.category}</td>
                                {userType === 'admin' && (
                                    <td>
                                        <button onClick={() => handleEdit(index)}>Edit</button>
                                        <button onClick={() => handleDelete(index)}>Delete</button>
                                    </td>
                                )}
                            </>
                        )}
                    </tr>
                ))}
          </tbody>
        </Table>
    );
}

export default Items;