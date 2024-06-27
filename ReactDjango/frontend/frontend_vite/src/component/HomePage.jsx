// src/component/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <div className="jumbotron text-center">
        <div className="jumbotron-text-container">
          <h1 className="display-4">Test Your Trading Strategies with Trade Play Simulator</h1>
          <p className="lead">Learn to trade without jeopardizing real money</p>
          <Link to="/frontend/register" className="btn btn-primary btn-lg">Open Account</Link>
        </div>
      </div>
      <div className="features-container text-center">
        <div className="row">
          <div className="feature-item">
            <img src="/public/time.png" alt="Real-time Data" className="feature-icon" />
            <h5>Real-time Data</h5>
            <p>Experience realistic trading with full data access in your simulated account, making it feel just like the real thing. With our simulator, you get real-time market data and a variety of trading tools to analyze trends and make informed decisions.</p>
          </div>
          <div className="feature-item">
            <img src="/public/risk.png" alt="Zero Risk" className="feature-icon" />
            <h5>Zero Risk</h5>
            <p>You don't need to be an expert to start. Use our free trading simulator to practice buying and selling without any risk. Improve your skills and build confidence with no capital at stake.</p>
          </div>
          <div className="feature-item">
            <img src="/public/file.png" alt="Unlimited Paper Trading Dollars" className="feature-icon" />
            <h5>$10,000 Virtual Money</h5>
            <p>Start with $10,000 in your account and practice trading as much as you want without any financial risk. Our trading simulator lets you experience real market conditions without the worry of losing money.</p>
          </div>
        </div>
      </div>

      <div className="portfolio-section">
        <div className="portfolio-text">
          <h2>Diversify your portfolio</h2>
          <p>Invest in a variety of asset classes across multiple global stock exchanges while managing all of your holdings in one place. Diversify your portfolio with ease and keep track of your investments seamlessly.</p>
          <Link to="/frontend/register" className="btn btn-secondary">Create Your Portfolio</Link>
        </div>
        <div className="portfolio-cards">
          <img src="/port.png" alt="Diversified Portfolio" className="cards-image" />
        </div>
      </div>

      <div className="copy-investors-section">
        <div className="copy-investors-background"></div>
        <div className="copy-investors-content">
        <div className="investor-photo">
            <img src="/public/computer.png" alt="Top Investor" className="investor-image" />
        </div>
          <div className="copy-text">
            <h2>Research and Trade with Confidence</h2>
            <p>Explore and research the assets you want to trade with our comprehensive tools. Stay updated with the latest news and market trends to make informed decisions. Trade seamlessly and without worry, knowing you have all the information you need at your fingertips.</p>
            <Link to="/frontend/register" className="btn btn-primary">Start Trading</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
