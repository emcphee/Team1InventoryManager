import Table from 'react-bootstrap/Table';
import './css/Items.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function Items() {

    const userType = 'admin';
    const navigate = useNavigate();
    const { warehouseId } = useParams();
    const [itemsList, setItemsList] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingItem, setEditingItem] = useState({ itemId: null, itemName: '', amount: 0, categories: '' });
    const [editStock, setEditStock] = useState({amount: 0});
    const [originalStockAmount, setOriginalStockAmount] = useState(0);
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch warehouse items
                const response = await fetch(`https://localhost:7271/api/Warehouse/${warehouseId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setItemsList(data.items);
                } else {
                    throw response;
                }

                // Fetch available categories for the warehouse
                const categoryResponse = await fetch(`https://localhost:7271/api/Item/category?warehouseId=${warehouseId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (categoryResponse.ok) {
                    const categories = await categoryResponse.json();
                    setAvailableCategories(categories);  // Set full list of available categories
                } else {
                    throw categoryResponse;
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [warehouseId]);


    const handleLogsClick = (warehouseId) => {
        navigate(`/warehouses/logs/${warehouseId}`);
    };

    const handleUsersClick = (warehouseId) => {
        navigate(`/warehouses/users/${warehouseId}`);
    };

    const extractUniqueCategories = (items) => {
        const categories = new Set(); //store unique categories
        items.forEach(item => {
            item.categories.forEach(category => {
                categories.add(category);
            });
        });
        setUniqueCategories(Array.from(categories)); // Convert Set back to Array
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
    };

    const filteredItems = selectedCategories.length > 0
        ? itemsList.filter(item => item.categories.some(category => selectedCategories.includes(category)))
        : itemsList;

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditingItem(itemsList[index]);
        setOriginalStockAmount(itemsList[index].amount);
        setEditStock({ amount: itemsList[index].amount });
        setSelectedCategories(itemsList[index].categories); // Set selected categories for editing
    }

    const handleConfirm = async (index) => {
        const updatedItems = [...itemsList];
        updatedItems[index] = editingItem;
        setItemsList(updatedItems);
        setEditingIndex(null);

        // Update categories in the API
        await updateCategories(editingItem.itemId, selectedCategories, itemsList[index].categories);
        const amountDifference = editStock.amount - originalStockAmount;
        if (amountDifference !== 0) {
            await changeStock(editingItem.itemId, amountDifference);
        }
    };

    const updateCategories = async (itemId, newCategories, oldCategories) => {
        const categoriesToAdd = newCategories.filter(category => !oldCategories.includes(category));
        const categoriesToRemove = oldCategories.filter(category => !newCategories.includes(category));

        // Apply new categories
        for (const category of categoriesToAdd) {
            await fetch(`https://localhost:7271/api/Item/applyCategory/${itemId}/${category}`, { 
                method: 'POST',
                credentials: 'include'});
        }

        // Remove old categories
        for (const category of categoriesToRemove) {
            await fetch(`https://localhost:7271/api/Item/unapplyCategory/${itemId}/${category}`, {
                method: 'DELETE',
                credentials: 'include' });
        }
    };

     const changeStock = async (itemId, amount) => {
        try {
            const response = await fetch(`https://localhost:7271/api/StockTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                credentials: 'include',
                body: JSON.stringify({ itemId, amount })
            });

            if (response.ok) {
                const data = await response.json();
                setItemsList(data.items);
                extractUniqueCategories(data.items);
            } else {
                throw response;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleStockChange = (e) => {
        const { value } = e.target;
        setEditStock((prevStock) => ({
            ...prevStock,
            amount: Number(value)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingItem((prevItem) => ({
            ...prevItem,
            [name]: value
        }));
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleDelete = (index) => {
        console.log('delete', index);
    }

    return (
        <>
        <button className="logs" onClick={() => handleLogsClick(warehouseId)}>Logs</button>
        <button className="items" onClick={() => handleUsersClick(warehouseId)}>Users</button>
        <div className="dropdown">
                <button onClick={toggleDropdown}>
                    {selectedCategories.length > 0 ? selectedCategories.join(", ") : "Select Categories"}
                </button>
                {dropdownOpen && (
                    <div className="dropdown-content">
                        {availableCategories.map((category, idx) => (
                            <label key={idx}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        <Table bordered hover responsive className='fixed-table'>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Category</th>
              {userType === 'admin' && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {filteredItems.map((item, index) => (
                    <tr key={index}>
                        {editingIndex === index ? (
                            <>
                                <td>
                                    {item.itemId}
                                </td>
                                <td>
                                    {item.itemName}
                                </td>
                                <td>
                                    <input
                                            type="number"
                                            name="amount"
                                            value={editStock.amount}
                                            onChange={handleStockChange}
                                        />
                                </td>
                                <td>
                                    <select
                                            name="categories"
                                            multiple
                                            value={editingItem.categories}
                                            onChange={(e) => {
                                                const options = e.target.options;
                                                const selected = [];
                                                for (let i = 0; i < options.length; i++) {
                                                    if (options[i].selected) {
                                                        selected.push(options[i].value);
                                                    }
                                                }
                                                setEditingItem((prevItem) => ({
                                                    ...prevItem,
                                                    categories: selected
                                                }));
                                            }}
                                        >
                                            {availableCategories.map((category, idx) => (
                                                <option key={idx} value={category}>{category}</option>
                                            ))}
                                        </select>
                                </td>
                                <td>
                                    <button onClick={() => handleConfirm(index)}>Confirm</button>
                                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{item.itemId}</td>
                                <td>{item.itemName}</td>
                                <td>{item.amount}</td>
                                <td>{item.categories.length === 0 ? "No category" : item.categories.join(", ")}</td>
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
        </>
    );
}

export default Items;