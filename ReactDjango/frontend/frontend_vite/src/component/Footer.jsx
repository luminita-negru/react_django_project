import React from 'react';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h4>Why TradePlaySimulator</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Learn</h4>
        <ul>
          <li><Link to="/frontend/news">News</Link></li>
          <li><Link to="/frontend/research">Research</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Support</h4>
        <ul>
          <li><Link to="/frontend/faq">FAQs</Link></li>
          <li><Link to="/frontend/contact">Contact</Link></li>
          <li><Link to="/frontend/donate">Donate</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
