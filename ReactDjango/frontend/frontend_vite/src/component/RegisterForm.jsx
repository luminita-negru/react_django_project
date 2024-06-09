import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    first_name: '',
    last_name: '',
    portfolio_name: '',
    net_worth: '',
    risk_tolerance: '',
    objective: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register/', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage(response.data.message);
      navigate('/frontend/login');
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {/* Basic User Info */}
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="password2" value={formData.password2} onChange={handleChange} required />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        {/* Profile Info */}
        <div>
          <label>Portfolio Name:</label>
          <input type="text" name="portfolio_name" value={formData.portfolio_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Net Worth:</label>
          <input type="number" name="net_worth" value={formData.net_worth} onChange={handleChange} required />
        </div>
        <div>
          <label>Risk Tolerance:</label>
          <input type="text" name="risk_tolerance" value={formData.risk_tolerance} onChange={handleChange} required />
        </div>
        <div>
          <label>Objective:</label>
          <input type="text" name="objective" value={formData.objective} onChange={handleChange} required />
        </div>
        
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
