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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStockData = async () => {
    try {
      const params = { symbol, period };
      if (period === 'custom') {
        if (!startDate || !endDate) {
          alert("Please provide both start and end dates for the custom interval.");
          return;
        }
        params.start = startDate;
        params.end = endDate;
      }
      const response = await axios.get(`http://localhost:8000/get_stock_data/`, { params });
      setCurrentPrice(response.data.current_price);
      setHistoricalData(JSON.parse(response.data.historical_data));
      setStockInfo(response.data.info);
    } catch (error) {
      console.error('Error fetching stock data', error);
    }
  };

  const chartData = {
    labels: Object.keys(historicalData || {}).map(x => {
      const date = new Date(x * 1);
      if (period === '1d') {
        return date.toLocaleString(); 
      } else {
        return date.toLocaleDateString(); 
      }
    }),
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
        labels: {
          color: 'white' 
        }
      },
      title: {
        display: true,
        text: `${symbol} Stock Price`,
        color: 'white' 
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
          color: 'white' 
        },
        ticks: {
          color: 'white' 
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (USD)',
          color: 'white' 
        },
        ticks: {
          color: 'white' 
        }
      },
    },
  };

  return (
    <div className="container my-5">
      <div className="checker-container">
        <h1 className="news-title">Research/Lookup Symbol</h1>
        <p className="text-center">
          Use this tool to research and lookup stock symbols. Enter a stock ticker to get the latest financial data and historical prices. You can view data for various periods including daily, monthly, yearly, or a custom range.
        </p>
        <div className="row mb-3">
          <div className="col-12 col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="1d">This Day</option>
              <option value="1mo">This Month</option>
              <option value="1y">This Year</option>
              <option value="5y">Last 5 Years</option>
              <option value="custom">Custom Interval</option>
            </select>
          </div>
          {period === 'custom' && (
            <>
              <div className="col-12 col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <div className="row mb-3">
          <div className="col-12">
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
        <div className="checker-container">
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

      <div className="checker-container">
        <div className="chart-container">
          <Line options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default StockChecker;
