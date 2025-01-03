import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Maintenance from './components/Maintenance';
import Helpwall from './components/Helpwall';
import VisitorFeaturePage from './pages/VisitorFeaturePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LandingPage" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Sidebar" element={<Sidebar />} />
      <Route path="/Directory" element={<Directory />} />
      <Route path="/Helpwall" element={<Helpwall />} />
      <Route path="/Maintenance" element={<Maintenance />} />
      <Route path="/visitor" element={<VisitorFeaturePage />} />
    </Routes>
  );
};

export default AppRoutes;

