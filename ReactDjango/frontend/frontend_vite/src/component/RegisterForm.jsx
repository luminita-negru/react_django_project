import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-form-title">Register</h1>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Portfolio Name</label>
          <input
            type="text"
            name="portfolio_name"
            value={formData.portfolio_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Net Worth</label>
          <input
            type="number"
            name="net_worth"
            value={formData.net_worth}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Risk Tolerance</label>
          <select
            name="risk_tolerance"
            value={formData.risk_tolerance}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select...</option>
            <option value="Aggressive">Aggressive</option>
            <option value="Moderate">Moderate</option>
            <option value="Conservative">Conservative</option>
          </select>
        </div>
        <div className="form-group">
          <label>Objective</label>
          <input
            type="text"
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary submit-button">Submit</button>
        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/frontend/login" className="auth-form-title">Go to Login</Link></p>
        </div>
      </form>
      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
};

export default RegisterForm;
