import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
// Import other components as needed

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
