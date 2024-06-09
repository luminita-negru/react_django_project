// src/components/StockChecker.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChecker = () => {
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState('1d');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [historicalData, setHistoricalData] = useState({});
  const [stockInfo, setStockInfo] = useState({});

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/get_stock_data/`, {
        params: { symbol, period },
      });
      setCurrentPrice(response.data.current_price);
      setHistoricalData(JSON.parse(response.data.historical_data));
      setStockInfo(response.data.info);
    } catch (error) {
      console.error('Error fetching stock data', error);
    }
  };

  const chartData = {
    labels: Object.keys(historicalData || {}).map(x => new Date(x * 1).toLocaleString()),
    datasets: [
      {
        label: 'Close Price',
        data: Object.values(historicalData || {}),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} Stock Price`,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  };

  return (
    <div className="container my-5">
      <div className="card p-3 mb-3">
        <div className="row mb-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="1d">Daily</option>
              <option value="1mo">Monthly</option>
              <option value="specific">Specific Month</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <button className="submit-button" onClick={fetchStockData}>Check Stock</button>
          </div>
        </div>
        {currentPrice && (
          <div className="h3">
            <h3>Current Price: {currentPrice}</h3>
          </div>
        )}
      </div>

      {Object.keys(stockInfo).length > 0 && (
        <div className="card p-3 mb-3">
          <div className="row">
            <div className="col-6 col-md-4"><strong>Market Cap:</strong> {stockInfo.market_cap}</div>
            <div className="col-6 col-md-4"><strong>EPS:</strong> {stockInfo.eps}</div>
            <div className="col-6 col-md-4"><strong>Dividend Yield:</strong> {stockInfo.dividend_yield}</div>
            <div className="col-6 col-md-4"><strong>P/E Ratio:</strong> {stockInfo.pe_ratio}</div>
            <div className="col-6 col-md-4"><strong>52-Week High:</strong> {stockInfo['52_week_high']}</div>
            <div className="col-6 col-md-4"><strong>52-Week Low:</strong> {stockInfo['52_week_low']}</div>
            <div className="col-6 col-md-4"><strong>Volume:</strong> {stockInfo.volume}</div>
            <div className="col-6 col-md-4"><strong>Day's High:</strong> {stockInfo.day_high}</div>
            <div className="col-6 col-md-4"><strong>Day's Low:</strong> {stockInfo.day_low}</div>
          </div>
        </div>
      )}

      <div className="card p-3">
        <div className="chart-container">
          <Line options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default StockChecker;
