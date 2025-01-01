import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4069/society/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        navigate('/'); // Redirect to the landing page
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3>Features</h3>
        <ul className="feature-list">
          <li onClick={() => navigate('/directory')}>Directory</li>
          <li onClick={() => navigate('/maintenance')}>Maintenance</li>
          <li onClick={() => navigate('/classes')}>Enrichment Classes</li>
          <li onClick={() => navigate('/daycare')}>Daycare Service</li>
          <li onClick={() => navigate('/localsupport')}>Local Support</li>
          <li>Bookings</li>
          <li>HelpWall</li>
          <li>Emergency</li>
          <li>Lost & Found</li>
          <li>Marketplace</li>
          <li onClick={() => navigate('/fitness')}>Fitness and Mental Health Care</li>
          <li onClick={() => navigate('/feedback')}>Feedback, Complaints and Suggestions</li>
          <li className="separator"></li>
          
          
          <li onClick={() => navigate('/profile')}>My Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
    </aside>
  );
}
export default Sidebar;