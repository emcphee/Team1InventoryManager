import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";

function WarehouseButtons({ onEditClick, onDeleteClick }) {

    const handleButtonClick = (event, type) => {
        event.stopPropagation();
        if (type === 'delete') {
            onDeleteClick();
        } else if (type === 'edit') {
            onEditClick(); 
        }
    }

    return (
        <div className='warehouse-button-group'>
            <ButtonGroup>
                <Button variant='primary' onClick={(event) => handleButtonClick(event, 'edit')}>Edit Details</Button>
                <Button variant='danger' onClick={(event) => handleButtonClick(event, 'delete')}>Delete</Button>
            </ButtonGroup>
        </div>
    );
}

export default WarehouseButtons;
