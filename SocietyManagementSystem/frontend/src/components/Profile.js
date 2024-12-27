import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage or an API endpoint
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:4069/api/getUserData');
      const data = await response.json();
      setUserData(data);
    };
    
    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Clear stored user data and tokens
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="navbar-left">
          {userData && userData.admin && <span>Admin Dashboard</span>}
        </div>
        <div className="navbar-right">
          <button onClick={handleProfileClick}>My Profile</button>
          <button onClick={handleLogout}>Logout</button>
          {showDropdown && userData && (
            <div className="dropdown">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Contact No:</strong> {userData.contactno}</p>
              <p><strong>User Type:</strong> {userData.usertype}</p>
              {userData.usertype === 'resident' && (
                <p><strong>Flat No:</strong> {userData.flatno}</p>
              )}
              {userData.usertype === 'maintenance' && (
                <p><strong>Maintenance Role:</strong> {userData.role}</p>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="content">
        <aside className="side-panel">
          <h3>General Notice and Announcements</h3>
          <ul>
            <li>Notice 1</li>
            <li>Notice 2</li>
            {/* Add more notices here */}
          </ul>
        </aside>
        <main className="main-content">
          <div className="button-container">
            <button className="profile-button">Directory</button>
            <button className="profile-button">Home Maintanace</button>
            <button className="profile-button">Bookings</button>
            <button className="profile-button">Classes</button>
            <button className="profile-button">HelpWall</button>
            <button className="profile-button">Visitor Tracker</button>
            <button className="profile-button">Lost & Found</button>
            <button className="profile-button">Marketplace</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;








