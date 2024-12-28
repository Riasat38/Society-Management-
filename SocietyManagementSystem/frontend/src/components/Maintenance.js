import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Maintenance.css';

function Maintenance() {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch service requests on component mount
    const fetchServiceRequests = async () => {
      try {
        const response = await fetch('http://localhost:4069/society/service-requests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setRequests(data.serviceRequests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    };

    fetchServiceRequests();
  }, []);

  const handleNewServiceRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authorization token is missing.');
      return;
    }
    console.log('Submitting new service request:', { serviceType, description });
    try {
      const response = await fetch(`http://localhost:4069/society/service-requests/${serviceType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Service request posted successfully');
        setRequests([...requests, data.service]);
      } else {
        setMessage(data.error);
        console.error('Error response from backend:', data);
      }
    } catch (error) {
      console.error('Error posting service request:', error);
      setMessage('Failed to post service request');
    }
  };

  return (
    <div className="maintenance-page">
      <aside className="sidebar">
        <div className="sidebar-content">
          <h3>Features</h3>
          <ul className="feature-list">
            <li onClick={() => navigate('/directory')}>Directory</li>
            <li onClick={() => navigate('/maintenance')}>Maintenance</li>
            <li onClick={() => navigate('/bookings')}>Bookings</li>
            <li onClick={() => navigate('/classes')}>Classes</li>
            <li onClick={() => navigate('/helpwall')}>HelpWall</li>
            <li onClick={() => navigate('/emergency')}>Emergency</li>
            <li onClick={() => navigate('/lostfound')}>Lost & Found</li>
            <li onClick={() => navigate('/marketplace')}>Marketplace</li>
            <li className="separator"></li>
            <li onClick={() => navigate('/profile')}>My Profile</li>
            <li onClick={() => navigate('/landingpage')}>Logout</li>
            
          </ul>
        </div>
      </aside>
      <main className="main-content">
        <div className="maintenance-content">
          <h2>New Service Request</h2>
          <form onSubmit={handleNewServiceRequest}>
            <div>
              <label>Service Type:</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
                <option value="">Select Service Type</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Description:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit">Submit</button>
          </form>
          {message && <p>{message}</p>}

          <h2>Service Requests</h2>
          <ul>
            {requests.map((request) => (
              <li key={request._id}>
                <p>Type: {request.serviceType}</p>
                <p>Description: {request.description}</p>
                <p>Status: {request.resolve_status ? 'Resolved' : 'Pending'}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Maintenance;



