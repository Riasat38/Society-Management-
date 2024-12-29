import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [userData, setUserData] = useState(null);
  const [jobList, setJobList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:4069/society/getUserData');
      const data = await response.json();
      setUserData(data);
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch job postings if the user is an admin
    const fetchJobList = async () => {
      if (userData && userData.admin) {
        const response = await fetch('http://localhost:4069/society/recruitments');
        const data = await response.json();
        setJobList(data.job_list);
      }
    };

    fetchJobList();
  }, [userData]);

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
    <div className="home-page">
      <aside className="sidebar">
        <div className="sidebar-content">
          <h3>Features</h3>
          <ul className="feature-list">
            <li>Directory</li>
            <li onClick={() => navigate('/maintenance')}>Maintenance</li>
            <li>Bookings</li>
            <li>Classes</li>
            <li>HelpWall</li>
            <li>Emergency</li>
            <li>Lost & Found</li>
            <li>Marketplace</li>
            <li className="separator"></li>
            <li onClick={() => navigate('/profile')}>My Profile</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
          {userData && userData.admin && (
            <div className="admin-panel">
              <h4>Admin Panel</h4>
              <ul className="admin-list">
                {jobList.map((job) => (
                  <li key={job.serial}>
                    <p><strong>Title:</strong> {job.title}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
      <main className="main-content">
        <h1>Ekhane Notice add hobe</h1>
        
        {/* Additional content can go here */}
      </main>
    </div>
  );
}

export default Home;













