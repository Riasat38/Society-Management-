import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Directory from './components/Directory';
import Maintenance from './components/Maintenance';
import Classes from './components/Classes';
import Daycare from './components/Daycare';
import LocalSupport from './components/LocalSupport';
import Fitness from './components/Fitness';
import Feedback from './components/Feedback';
import Helpwall from './components/Helpwall';
import VisitorFeaturePage from './pages/VisitorFeaturePage'
import HelpWall from './components/Helpwall';



import './App.css';

const AppContent = () => {
  const location = useLocation();
  const showSidebar = !['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="App">
      <Header />
      <div className={`main-layout ${showSidebar ? 'with-sidebar' : ''}`}>
        {showSidebar && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/helpwall" element={<Helpwall />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/daycare" element={<Daycare />} />
            <Route path="/helpwall" element={<Helpwall />} />
            <Route path="/localsupport" element={<LocalSupport />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/visitor" element={<VisitorFeaturePage />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;




