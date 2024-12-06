import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';


function Signup() {
  const [name,setName]=useState()
  const [email,setEmail]=useState()
  const [password,setPassword]=useState()
  const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/register ',{name,email,password})
    .then(result => console.log(result))
    .catch(err=>console.log(err))
  }
  return (
    <div className="container">
      <h2 className="title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="name" className="label">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="email" className="label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="password" className="label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="button">Sign Up</button>
        <div className="login-redirect">
        <p>Already have an account? <a href="/login" className="login-link">Login</a></p>
      </div>
      </form>
    </div>
  );
}

export default Signup;
