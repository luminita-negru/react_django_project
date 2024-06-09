import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/trading/portfolio/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch portfolio data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const { user_profile, portfolio } = data;
  
  if (!data || !data.user_profile || !data.portfolio) {
    return <p>No data available.</p>;
  }

  return (
    <div className="portfolio-container">
      <div className="overview">
        <h2>Account Value: ${portfolio.balance.toFixed(2)}</h2>
        <p>Buying Power: ${portfolio.balance.toFixed(2)}</p>
        <p>Cash: ${portfolio.balance.toFixed(2)}</p>
      </div>
      <div className="performance">
        <h2>Performance</h2>
        {/* Performance chart component */}
      </div>
      <div className="user-info">
        <h2>User Info</h2>
        <p>Risk Tolerance: {user_profile.risk_tolerance}</p>
        <p>Objective: {user_profile.objective}</p>
      </div>
      <div className="holdings">
        <h2>Holdings</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Description</th>
              <th>Current Price</th>
              <th>Purchase Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th>Total Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map(asset => (
              <tr key={asset.symbol}>
                <td>{asset.symbol}</td>
                <td>{asset.name}</td>
                <td>${asset.last_price}</td>
                <td>${asset.buy_price}</td>
                <td>{asset.available_shares}</td>
                <td>${(asset.available_shares * asset.last_price).toFixed(2)}</td>
                <td>${((asset.last_price - asset.buy_price) * asset.available_shares).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
