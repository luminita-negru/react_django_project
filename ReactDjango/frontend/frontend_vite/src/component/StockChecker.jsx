// src/components/StockChecker.js
import React, { useState } from 'react';
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
    const [plot, setPlot] = useState('');

    const fetchStockData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/get_stock_data/`, {
                params: { symbol, period }
            });
            setCurrentPrice(response.data.current_price);
            console.log(JSON.parse(response.data.historical_data))
            setHistoricalData(JSON.parse(response.data.historical_data));
            setPlot("true")
        } catch (error) {
            console.error('Error fetching stock data', error);
        }
    };

    const chartData = {
        labels: Object.keys(historicalData || {}).map(x=>new Date(x*1).toLocaleString()),
        datasets: [
            {
                label: 'Close Price',
                data: Object.values(historicalData || {}),
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
            }
        ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart',
        },
      },
    };

    return (
        <div>
            <h2>Research Stock</h2>
            <input
                type="text"
                placeholder="Stock Symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="1d">Daily</option>
                <option value="1mo">Monthly</option>
                <option value="specific">Specific Month</option>
            </select>
            {period === 'specific' && (
                <input
                    type="month"
                    onChange={(e) => setPeriod(e.target.value)}
                />
            )}
            <button onClick={fetchStockData}>Check Stock</button>
            {currentPrice && <h3>Current Price: {currentPrice}</h3>}
            {plot && (
                <div className="chart-container">
                    <Line options={options} data={chartData} />
                </div>
            )}
        </div>
    );
};

export default StockChecker;
