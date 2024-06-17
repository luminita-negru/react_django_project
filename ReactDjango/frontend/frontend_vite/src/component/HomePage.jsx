// src/component/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <div className="jumbotron text-center">
        <div className="jumbotron-text-container">
          <h1 className="display-4">Our Trading Simulator Lets You Test Your Skills</h1>
          <p className="lead">Learn to trade without jeopardizing real money</p>
          <Link to="/frontend/register" className="btn btn-primary btn-lg">Open Account</Link>
        </div>
      </div>
      <div className="features-container text-center">
        <div className="row">
          <div className="feature-item">
            <img src="/public/time.png" alt="Real-time Data" className="feature-icon" />
            <h5>Real-time Data</h5>
            <p>Your simulated trading account includes data entitlements, so it looks (and feels) just like live trading.</p>
          </div>
          <div className="feature-item">
            <img src="/public/risk.png" alt="Zero Risk" className="feature-icon" />
            <h5>Zero Risk</h5>
            <p>You don't have to be an investment expert. Use our free trading simulator to practice buying and selling without the risk of losing any capital.</p>
          </div>
          <div className="feature-item">
            <img src="/public/file.png" alt="Unlimited Paper Trading Dollars" className="feature-icon" />
            <h5>$10,000 Virtual Money</h5>
            <p>Start with $10,000 in your account and practice trading as much as you want without any financial risk.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;