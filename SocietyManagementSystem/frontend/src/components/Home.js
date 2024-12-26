import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home">
      <h1>Welcome to Heritage Garden</h1>
      <div className="auth-options">
        <button className="auth-button" onClick={handleLogin}>Login</button>
        <button className="auth-button" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Home;


