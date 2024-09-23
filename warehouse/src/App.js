import React, { useEffect } from 'react';
import './App.css';
import Login from './Login';
import Welcome from './Welcome';
import InventoryLog from './InventoryLog';
import Navigationbar from './NavigationBar';
import Warehouse from './Warehouse';
import Items from './Items';
import Categories from './Categories';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';


function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  }

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch('https://localhost:7271/api/UserAccount/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          handleLogin(data.username);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    checkLogin();
  } , []);


  return (
    <Router>
      <Navigationbar username={username} logout={handleLogout} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/welcome" /> : <Login login={handleLogin} />
        } />
        {/* private route so only users that are authenticated can access those pages */}
        <Route path="/warehouses" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Warehouse />
          </PrivateRoute>
        }/>

        <Route path="/welcome" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Welcome />
          </PrivateRoute>
        }/>

        <Route path="/logs" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <InventoryLog />
          </PrivateRoute>
        }/>

        <Route path="/warehouses/:warehouseId/categories" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Categories />
          </PrivateRoute>
        }/>

        <Route path="/warehouses/categories/:categoryId/" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Items />
          </PrivateRoute>
        }/>
        
        
      </Routes>
    </Router>
  );
}

function PrivateRoute({children, isLoggedIn}) {
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}

export default App;
