import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './css/NavigationBar.css';
import { Link } from 'react-router-dom';


function Navigationbar( {username, logout, isLoggedIn} ) {

  const handleLogout = () => {
    try {
      fetch('https://localhost:7271/api/UserAccount/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      logout();
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar expand="md" data-bs-theme="dark" className="bg-body-tertiary">
        <Container fluid>

        <Navbar.Brand as= {Link} to="/">Inventory Management System</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-false" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-false"
              aria-labelledby="offcanvasNavbarLabel-expand-false"
              placement="end"
              data-bs-theme="dark"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-false">
                  Navigation
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link as= {Link} to="/">Home</Nav.Link>
                  {/* <Nav.Link href="#action2">Inventory</Nav.Link> */}
                  <Nav.Link as= {Link} to="/warehouses">Warehouses</Nav.Link>
                  <NavDropdown title="Account" id="offcanvasNavbarDropdown">
                    <NavDropdown.Item href="#" disabled>{username}</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout} >Log Out</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigationbar;