import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Heritage Garden</h1>
      <div className="auth-options">
        <button className="auth-button" onClick={handleLogin}>Login</button>
        <button className="auth-button" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default LandingPage;


