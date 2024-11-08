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

const Trade = () => {
  const [transactionType, setTransactionType] = useState('buy');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [duration, setDuration] = useState('day');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [bidPrice, setBidPrice] = useState(null);
  const [askPrice, setAskPrice] = useState(null);
  const [pendingTransactions, setPendingTransactions] = useState([]);

  useEffect(() => {
    if (symbol) {
      const delayDebounceFn = setTimeout(() => {
        fetchStockData();
      }, 2000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [symbol]);

  useEffect(() => {
    fetchPendingTransactions();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      transaction_type: transactionType,
      symbol: symbol.toUpperCase(),
      quantity,
      order_type: orderType,
      duration,
      price,
    };

    axiosConfig.post(
      '/api/trading/trade/',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => {
      setMessage(res.data.message);
      setIsError(false);
      fetchPendingTransactions();
    })
     .catch((e) => {setMessage(e.response.data.message); setIsError(true);});
  };

  const fetchStockData = async () => {
    try {
      const response = await axiosConfig.get('/get_stock_data/', {
        params: { symbol, period: '1d' },
      });
      const historicalData = JSON.parse(response.data.historical_data);
      const labels = Object.keys(historicalData).map(
        (x) => new Date(parseInt(x)).toLocaleString()
      );
      const data = Object.values(historicalData);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Close Price',
            data,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            fill: true,
            tension: 0.4,
          },
        ],
      });
      setBidPrice(response.data.info.bid);
      setAskPrice(response.data.info.ask);
    } catch (error) {
      console.error('Error fetching stock data', error);
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      const response = await axiosConfig.get('/api/trading/trade/');
      setPendingTransactions(response.data.pending_transactions);
    } catch (error) {
      console.error('Error fetching pending transactions', error);
    }
  };

  const cancelTransaction = async (transactionId) => {
    try {
      await axiosConfig.delete(`/api/trading/trade/${transactionId}/`);
      fetchPendingTransactions();
    } catch (error) {
      console.error('Error cancelling transaction', error);
    }
  };

  return (
    <div className="trade-page">
      <div className="trade-container">
        <h1>Trade Stocks</h1>
        <form className="trade-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction Type:</label>
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="form-group">
            <label>Symbol:</label>
            <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Order Type:</label>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>
          <div className="form-group">
            <label>Duration:</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="day">Day Only</option>
              <option value="gtc">Good Till Cancelled</option>
            </select>
          </div>
          {orderType === 'limit' && (
            <div className="form-group">
              <label>Price:</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          )}
          <button className="submit-button" type="submit">Submit</button>
        </form>
        {message && <p style={{color: isError?"#ff0000":"green"}} className="message">{message}</p>}
      </div>
      {chartData && (
        <div className="chart-container-trade">
          <h3>Stock Chart for {symbol.toUpperCase()}</h3>
          <p>Bid Price: {bidPrice}</p>
          <p>Ask Price: {askPrice}</p>
          <Line data={chartData} />
        </div>
      )}
      {pendingTransactions.length > 0 && (
        <div className="pending-transactions">
          <h3>Pending Transactions</h3>
          <ul>
            {pendingTransactions.map(tx => (
              <li key={tx.id}>
                {tx.symbol} - {tx.quantity} @ {tx.price} $ - {tx.transaction_type} 
                <button onClick={() => cancelTransaction(tx.id)}>Cancel</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Trade;
