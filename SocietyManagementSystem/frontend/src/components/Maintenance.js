import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Maintenance.css';

const Maintenance = () => {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [editRequestId, setEditRequestId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserDetails(token);
      fetchServiceRequests(token);
    } else {
      setMessage('Authorization token is missing. Please log in.');
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch('http://localhost:4069/society/login', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUserType(data.user.usertype);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to fetch user details.');
    }
  };

  const fetchServiceRequests = async (token) => {
    try {
      const response = await fetch('http://localhost:4069/society/homepage/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data.serviceRequests);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to fetch service requests.');
    }
  };


  const handleServiceRequest = async (url, method, body = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authorization token is missing. Please log in.');
      return;
    }
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
      });
      const data = await response.json();
      if (response.ok) {
        fetchServiceRequests(token);
        setMessage(data.message || 'Operation successful.');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to perform the operation.');
    }
  };


  const handleNewServiceRequest = (e) => {
    e.preventDefault();
    handleServiceRequest(`http://localhost:4069/society/homepage/services/${serviceType}`, 'POST', { description });
  };

  const handleDeleteRequest = (id) => {
    handleServiceRequest(`http://localhost:4069/society/homepage/services/${id}`, 'DELETE');
  };

  const handleUpdateRequest = (e) => {
    e.preventDefault();
    handleServiceRequest(`http://localhost:4069/society/homepage/services/${editRequestId}`, 'PUT', { description: editDescription });
    setEditRequestId(null);
    setEditDescription('');
  };

  const handleResolveRequest = (id) => {
    handleServiceRequest(`http://localhost:4069/society/homepage/services/${id}/resolve`, 'PATCH', { resolve_status: true });
  }; //The PATCH method allows you to update only specific fields of a resource. 
  
  const handleEditRequest = (id, description) => {
    setEditRequestId(id);
    setEditDescription(description);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authorization token is missing. Please log in.');
      return;
    }
    try {
      const response = await fetch('http://localhost:4069/society/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error logging out.');
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
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      </aside>
      <main className="main-content">
        {userType === 'resident' ? (
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
                  <p>ID: {request._id}</p>
                  <p>Type: {request.serviceType}</p>
                  <p>Description: {request.description}</p>
                  <p>Status: {request.resolve_status ? 'Resolved' : 'Pending'}</p>
                  <button onClick={() => handleDeleteRequest(request._id)}>Delete</button>
                  <button onClick={() => handleEditRequest(request._id, request.description)}>Edit</button>
                </li>
              ))}
            </ul>

            {editRequestId && (
              <div className="edit-form">
                <h2>Edit Service Request</h2>
                <form onSubmit={handleUpdateRequest}>
                  <div>
                    <label>Description:</label>
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  </div>
                  <button type="submit">Update</button>
                  <button onClick={() => setEditRequestId(null)}>Cancel</button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="maintenance-content">
            <h2>Service Requests</h2>
            <ul>
              {requests.map((request) => (
                <li key={request._id}>
                  <p>ID: {request._id}</p>
                  <p>Type: {request.serviceType}</p>
                  <p>Description: {request.description}</p>
                  <p>Status: {request.resolve_status ? 'Resolved' : 'Pending'}</p>
                  <button onClick={() => handleResolveRequest(request._id)}>Resolve</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Maintenance;










