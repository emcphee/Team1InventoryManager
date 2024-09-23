import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import Warehouse from './Warehouse';

function Categories() {

    const navigate = useNavigate();

    const handleItemClick = (categoryId) => {
        navigate(`/warehouses/categories/${categoryId}`);
    }

    const categoriesList = [
        {
            id: 1,
            name: "Electronics"
        },
        {
            id: 2,
            name: "Clothing"
        },
        {
            id: 3,
            name: "Food"
        },
        {
            id: 4,
            name: "Furniture"
        },
        {
            id: 5,
            name: "Books"
        }
    ];

    return (
        <>
            <h1>Categories</h1>
            <ListGroup variant='flush'>
                {categoriesList.map((category, index) => (
                    <ListGroup.Item key={index} action onClick={() => handleItemClick(category.name)}>
                        <div><strong>{category.name}</strong></div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}

export default Categories;