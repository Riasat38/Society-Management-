import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Maintenance.css';
import { getUserFromStorage } from './utils.js';

const MaintenancePage = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const token = getUserFromStorage();

    if (!token) {
      // Redirect to login if no user is found
      window.location.href = '/society/login';
      return;
    }

    setUser(token); // Setting the token in the user state

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage/services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setRequests(response.data.requests);
        console.log('Maintenance requests fetched:', response.data.requests);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePostRequest = async () => {
    const token = user.token;
    const newRequest = { serviceType, description };

    try {
      const response = await axios.post(`http://localhost:4069/society/homepage/services/${serviceType}`, newRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests([...requests, response.data.request]);
      setServiceType('');
      setDescription('');
      console.log('Maintenance request posted:', response.data.request);
    } catch (error) {
      console.error('Failed to post data:', error);
    }
  };

  const handleUpdateRequest = async (id, updatedDescription) => {
    const token = user.token;

    try {
      const response = await axios.put(`http://localhost:4069/society/homepage/services/${id}`, { description: updatedDescription }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests(requests.map(request => request._id === id ? response.data.request : request));
      console.log('Maintenance request updated:', response.data.request);
    } catch (error) {
      console.error('Failed to update data:', error);
    }
  };

  const handleDeleteRequest = async (id) => {
    const token = user.token;

    try {
      await axios.delete(`http://localhost:4069/society/homepage/services/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests(requests.filter(request => request._id !== id));
      console.log('Maintenance request deleted:', id);
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  };

  const handleResolveRequest = async (id) => {
    const token = user.token;

    try {
      await axios.post(`http://localhost:4069/society/homepage/services/${id}/resolve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests(requests.filter(request => request._id !== id));
      console.log('Maintenance request resolved:', id);
    } catch (error) {
      console.error('Failed to resolve data:', error);
    }
  };

  const renderRequestForm = () => (
    <div className="request-form">
      <h3>Post a Maintenance Request</h3>
      <label>
        Service Type:
        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <option value="">Select</option>
          <option value="electric">Electric</option>
          <option value="plumbing">Plumbing</option>
          <option value="others">Others</option>
        </select>
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </label>
      <button onClick={handlePostRequest}>Submit Request</button>
    </div>
  );

  const renderRequests = () => (
    <div className="requests-list">
      <h3>Posted Maintenance Requests</h3>
      <ul>
        {requests && requests.length > 0 ? (
          requests.map(request => (
            <li key={request._id}>
              <p>Service Type: {request.serviceType}</p>
              <p>Description: {request.description}</p>
              {user?.usertype === 'resident' && (
                <>
                  <button onClick={() => handleUpdateRequest(request._id, prompt('Update description:', request.description))}>Update</button>
                  <button onClick={() => handleDeleteRequest(request._id)}>Delete</button>
                </>
              )}
              {user?.usertype === 'maintenance' && (
                <>
                  <p>Name: {request.residentName}</p>
                  <p>Email: {request.residentEmail}</p>
                  <p>Contact Number: {request.residentContact}</p>
                  <p>Flat Number: {request.residentFlat}</p>
                  <button onClick={() => handleResolveRequest(request._id)}>Resolve</button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No maintenance requests found.</p>
        )}
      </ul>
    </div>
  );

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Maintenance</h2>
        {user?.usertype === 'resident' ? (
          <div className="resident-content">
            <div className="post-request">{renderRequestForm()}</div>
            <div className="view-requests">{renderRequests()}</div>
          </div>
        ) : (
          renderRequests()
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;

 