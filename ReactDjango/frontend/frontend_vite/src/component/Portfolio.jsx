import React, { useState, useEffect } from 'react';
import axiosConfig from '../interceptors/axiosConfig';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Portfolio = () => {
  const [data, setData] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountValue, setAccountValue] = useState(0.0);
  const [assets, setAssets] = useState([]);
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosConfig.get('/api/trading/portfolio/');
        setData(response.data);
        setBalance(response.data.portfolio.balance);
        prepareChartData(response.data.portfolio.history);
      } catch (error) {
        setError('Failed to fetch portfolio data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const prepareChartData = (history) => {
    if (!history) return;

    const labels = history.map(entry => new Date(entry.timestamp).toLocaleString());
    const values = history.map(entry => parseFloat(entry.value));
    setChartData({
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: values,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  useEffect(() => {
    let ws;

    const fetchUuidAndConnectWebSocket = async () => {
      try {
        const response = await axiosConfig.get('/auth_for_ws_connection/');
        const fetchedUuid = response.data.uuid;


        ws = new WebSocket(`ws://localhost:8000/ws/stock_data/?uuid=${fetchedUuid}`);
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if(data){
            setAssets(data['assets']);
            setBalance(data['balance']);
          }
          console.log(data);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };
      } catch (error) {
        console.error('Error fetching UUID or establishing WebSocket connection:', error);
      }
    };

    fetchUuidAndConnectWebSocket();

    return () => {
      console.log(ws)
      if (ws) {
        ws.close();
      }
    };
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
        <h2>Account Value: ${assets.map(obj=>obj['quantity']*obj['last_price']).reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        },0).toFixed(2)}</h2>
        <p>Balance: ${balance}</p>
      </div>
      <div className="performance">
        <h2>Performance</h2>
        {chartData && <Line data={chartData} />}
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
              <th>Current Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.symbol}>
                <td>{asset.symbol}</td>
                <td>${(asset.last_price || 0).toFixed(2)}</td>
                <td>{asset.quantity}</td>
                <td>${(asset.quantity * asset.last_price || 0).toFixed(2)}</td>
              </tr>
            ))} 
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
