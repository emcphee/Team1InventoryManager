import React from 'react';
import './App.css';
import Login from './Login';
import Welcome from './Welcome';
import InventoryLog from './InventoryLog';
import Navigationbar from './NavigationBar';
import Warehouse from './Warehouse';
import Items from './Items';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/warehouses" element={<Warehouse />} />
      </Routes>
      {/* <InventoryLog></InventoryLog> */}
      {/* <Items /> */}
      {/* <Login /> */}

    </Router>
  );
}

export default App;
