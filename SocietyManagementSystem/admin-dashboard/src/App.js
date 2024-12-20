// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Router components
import AnnouncementPage from './AnnouncementPage'; // Import the AnnouncementPage component
import './App.css'; // Import the CSS file for global styles

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Dashboard Page - default route */}
        <Route path="/" element={
          <div
            className="app-container"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1527767612165-ed1f4194a45c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2luZyUyMHNvY2lldHl8ZW58MHx8MHx8fDA%3D')`, // Admin dashboard background image
            }}
          >
            <header className="header">Welcome to the Admin Dashboard</header>
            <div className="buttons-container">
              {/* Link to navigate to the Announcement Page */}
              <Link to="/announcement">
                <button className="dashboard-button">Announcement</button>
              </Link>
              <button className="dashboard-button">Feedback & Report</button>
              <button className="dashboard-button">User Directory</button>
            </div>
          </div>
        } />

        {/* Route for Announcement Page */}
        <Route path="/announcement" element={<AnnouncementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
