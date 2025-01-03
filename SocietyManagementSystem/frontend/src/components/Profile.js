/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Profile.css';
import { getUserFromStorage } from './utils.js';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getUserFromStorage();

    if (!token) {
      window.location.href = '/society/login';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Profile Page</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Flat Number:</strong> {user.flatno || 'N/A'}</p>
          <p><strong>Contact Number:</strong> {user.contactno}</p>
          <p><strong>User Type:</strong> {user.usertype}</p>
          <p><strong>Role:</strong> {user.role || 'N/A'}</p>
          <p><strong>Joining Date:</strong> {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Profile.css';
import { getUserFromStorage } from './utils.js';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getUserFromStorage();

    if (!token) {
      window.location.href = '/society/login';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Profile Page</h2>
        <div className="profile-info">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>Username:</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Flat Number:</th>
                <td>{user.flatno || 'N/A'}</td>
              </tr>
              <tr>
                <th>Contact Number:</th>
                <td>{user.contactno}</td>
              </tr>
              <tr>
                <th>User Type:</th>
                <td>{user.usertype}</td>
              </tr>
              <tr>
                <th>Role:</th>
                <td>{user.role || 'N/A'}</td>
              </tr>
              <tr>
                <th>Joining Date:</th>
                <td>{user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
