import Table from 'react-bootstrap/Table';
import './css/Items.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function Items() {

    const navigate = useNavigate();
    const { warehouseId } = useParams();
    const [itemsList, setItemsList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingItem, setEditingItem] = useState({ itemId: null, itemName: '', amount: 0, categories: '' });
    const [editStock, setEditStock] = useState({amount: 0});
    const [originalStockAmount, setOriginalStockAmount] = useState(0);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); // For editing
    const [selectedFilterCategories, setSelectedFilterCategories] = useState([]); // For filtering
    const [dropdownOpen, setDropdownOpen] = useState(false);
    //Adding new items
    const [showNewItemForm, setShowNewItemForm] = useState(false);
    const [newItem, setNewItem] = useState({ itemName: '', amount: 0, categories: [] });
    //Permission Level
    const [permissionLevel, setPermissionLevel] = useState(null);
    //Adding and Removing Categories
    const [newCategory, setNewCategory] = useState('');
    const [removeCategory, setRemoveCategory] = useState('');
    const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
    const [showRemoveCategoryInput, setShowRemoveCategoryInput] = useState(false);
    

    useEffect(() => {
        fetchWarehousePermissionLevel(warehouseId);
        fetchData();
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

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditingItem(itemsList[index]);
        setOriginalStockAmount(itemsList[index].amount);
        setEditStock({ amount: itemsList[index].amount });
        setSelectedCategories(itemsList[index].categories); // Set selected categories for editing
    }

    const handleConfirm = async (index) => {
        const updatedItems = [...itemsList];
        updatedItems[index] = {
            ...editingItem,
            amount: editStock.amount // Set the new amount from editStock
        };
        setItemsList(updatedItems);
        setEditingIndex(null);
        
        await updateItemName(editingItem.itemId, editingItem.itemName);
        await updateCategories(editingItem.itemId, editingItem.categories, itemsList[index].categories);
        const amountDifference = editStock.amount - originalStockAmount;
        if (amountDifference !== 0) {
            await changeStock(editingItem.itemId, amountDifference);
        }
    };

    const handleLogsClick = (warehouseId) => {
        navigate(`/warehouses/logs/${warehouseId}`);
    };

    const handleUsersClick = (warehouseId) => {
        navigate(`/warehouses/users/${warehouseId}`);
    };
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    // Function for handling category change in dropdown (for filtering)
    const handleFilterCategoryChange = (category) => {
        setSelectedFilterCategories((prev) => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
    };

    const filteredItems = selectedFilterCategories.length > 0
        ? itemsList.filter(item => item.categories.some(category => selectedFilterCategories.includes(category)))
        : itemsList;

    const updateItemName = async (itemId, itemName) => {
        try {
            const response = await fetch(`https://localhost:7271/api/Item/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ itemName })
            });
    
            if (response.ok) {
                console.log(`Updated item name to: ${itemName}`);
            } else {
                throw response;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateCategories = async (itemId, newCategories, oldCategories) => {
        const categoriesToAdd = newCategories.filter(category => !oldCategories.includes(category));
        const categoriesToRemove = oldCategories.filter(category => !newCategories.includes(category));
    
        // Call the API to add new categories
        for (const category of categoriesToAdd) {
            const response = await fetch(`https://localhost:7271/api/Item/applyCategory/${itemId}/${category}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                console.error(`Failed to add category ${category}: ${response.statusText}`);
            }
        }
    
        // Call the API to remove old categories
        for (const category of categoriesToRemove) {
            const response = await fetch(`https://localhost:7271/api/Item/unapplyCategory/${itemId}/${category}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                console.error(`Failed to remove category ${category}: ${response.statusText}`);
            }
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
    
    const handleCreateItem = async () => {
        const newItemData = {
            itemName: newItem.itemName,
            amount: newItem.amount,
            warehouseId: warehouseId
        };
    
        try {
            const response = await fetch('https://localhost:7271/api/Item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newItemData)
            });
    
            if (response.ok) {
                const createdItem = await response.json();
                // Construct the full item object with name, amount, and categories
                const fullItem = {
                    itemId: createdItem.itemId,
                    itemName: newItem.itemName,
                    amount: newItem.amount,
                    warehouseId: warehouseId,
                    categories: newItem.categories // Set the categories to the created item
                };
                // Add the new item to the list
                setItemsList((prevItems) => [...prevItems, fullItem]);
                // Update categories with the new item's ID
                await updateCategories(createdItem.itemId, newItem.categories, []);
                // Reset the form and close it
                setShowNewItemForm(false);
                setNewItem({ itemName: '', amount: 0, categories: [] });
            } else {
                console.error('Error creating item:', response.statusText);
                throw new Error(`Failed to create item: ${response.statusText}`);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`https://localhost:7271/api/Item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include credentials if necessary
            });

            if (response.ok) {
                // Remove the item from the list if the deletion is successful
                setItemsList((prevItems) => prevItems.filter(item => item.itemId !== itemId));
                console.log(`Item with ID ${itemId} has been deleted.`);
            } else {
                console.error(`Failed to delete item with ID ${itemId}:`, response.statusText);
                throw new Error(`Failed to delete item: ${response.statusText}`);
            }
        } catch (error) {
            console.log('Error deleting item:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return; // Ensure a category is provided

        try {
            const response = await fetch(`https://localhost:7271/api/Item/category/${warehouseId}/${newCategory}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                console.log(`Category "${newCategory}" added successfully.`);
                setNewCategory(''); // Clear the input after success
                await fetchData(); // Fetch updated categories
            } else {
                console.error(`Failed to add category: ${response.statusText}`);
            }
        } catch (error) {
            console.log('Error adding category:', error);
        }
    };

    const handleRemoveCategory = async () => {
        if (!removeCategory) return; // Ensure a category is provided

        try {
            const response = await fetch(`https://localhost:7271/api/Item/category/${warehouseId}/${removeCategory}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                console.log(`Category "${removeCategory}" removed successfully.`);
                setRemoveCategory(''); // Clear the input after success
                await fetchData(); // Fetch updated categories
            } else {
                console.error(`Failed to remove category: ${response.statusText}`);
            }
        } catch (error) {
            console.log('Error removing category:', error);
        }
    };







    return (
        <>
        <button className="logs" onClick={() => handleLogsClick(warehouseId)}>Logs</button>
        <button className="items" onClick={() => handleUsersClick(warehouseId)}>Users</button>
        <div className="dropdown">
                <button onClick={toggleDropdown}>
                    {selectedFilterCategories.length > 0 ? selectedFilterCategories.join(", ") : "Filter by Categories"}
                </button>
                {dropdownOpen && (
                    <div className="dropdown-content">
                        {availableCategories.map((category, idx) => (
                            <label key={idx}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedFilterCategories.includes(category)}
                                    onChange={() => handleFilterCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                )}
        </div>
        {(permissionLevel === 1 || permissionLevel === 2) && (
            <span>
                <button className="items" onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}>
                    {showAddCategoryInput ? 'Close Add Category' : 'Add Category'}
                    {showAddCategoryInput && (
                    <div>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category"
                        />
                        <button onClick={handleAddCategory}>Submit</button>
                    </div>
                )}
                </button>
                <button className="items" onClick={() => setShowRemoveCategoryInput(!showRemoveCategoryInput)}>
                    {showRemoveCategoryInput ? 'Close Remove Category' : 'Remove Category'}
                    {showRemoveCategoryInput && (
                        <div>
                            <input
                                type="text"
                                value={removeCategory}
                                onChange={(e) => setRemoveCategory(e.target.value)}
                                placeholder="Enter category to remove"
                            />
                            <button onClick={handleRemoveCategory}>Submit</button>
                        </div>
                    )}
                </button>
            </span>
        )}
        <Table bordered hover responsive className='fixed-table'>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Category</th>
              {(permissionLevel === 1 || permissionLevel === 2) && (<th>Actions</th>)}
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
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={editingItem.itemName} // Bind to editingItem's itemName
                                        onChange={(e) => {
                                            setEditingItem((prevItem) => ({
                                                ...prevItem,
                                                itemName: e.target.value // Update itemName as user types
                                            }));
                                        }}
                                    />
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
                                {(permissionLevel === 1 || permissionLevel === 2) && (
                                    <td>
                                        <button onClick={() => handleEdit(index)}>Edit</button>
                                        <button onClick={() => handleDelete(item.itemId)}>Delete</button>
                                    </td>
                                )}
                            </>
                        )}
                    </tr>
                ))}
                {/* FORM FOR CREATING NEW ITEM */}
                {showNewItemForm && (
                <tr>
                    <td>
                        {/* Empty cell for Item ID, as it will be auto-generated */}
                    </td>
                    <td>
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={newItem.itemName}
                            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newItem.amount}
                            onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                        />
                    </td>
                    <td>
                        <select
                            multiple
                            value={newItem.categories}
                            onChange={(e) => {
                                const options = e.target.options;
                                const selectedCategories = [];
                                for (let i = 0; i < options.length; i++) {
                                    if (options[i].selected) {
                                        selectedCategories.push(options[i].value);
                                    }
                                }
                                setNewItem({ ...newItem, categories: selectedCategories });
                            }}
                        >
                            {availableCategories.map((category, idx) => (
                                <option key={idx} value={category}>{category}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <button onClick={handleCreateItem}>Confirm</button>
                        <button onClick={() => setShowNewItemForm(false)}>Cancel</button>
                    </td>
                </tr>
            )}
          </tbody>
        </Table>
        {(permissionLevel === 1 || permissionLevel === 2) && (
            <button className="logs" onClick={() => setShowNewItemForm(true)}>Add New Item</button>
        )}
        </>
    );
}

export default Items;

