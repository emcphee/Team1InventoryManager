import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import Form from "react-bootstrap/Form";
function WarehouseNewSubmit( { onAddWarehouse }) {

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onAddWarehouse(formData);
        setFormData({
            name: '',
            address: ''
        });
        setShowForm(false);
    }
    
    return (
        <div>
            <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add New Warehouse'}
            </Button>

            {showForm && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formWarehouseName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
                    </Form.Group>

                    <Form.Group controlId="formWarehouseAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} required/>
                    </Form.Group>

                    <Button variant='success' type='submit'>Submit</Button>
                </Form>
            )}
        </div>
    );
}

export default WarehouseNewSubmit;