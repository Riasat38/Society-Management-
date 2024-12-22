import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to Heritage Garden</h1>
      <div className="auth-options">
        <button className="auth-button" onClick={() => navigate('/login')}>Login</button>
        <button className="auth-button" onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}

export default Home;



