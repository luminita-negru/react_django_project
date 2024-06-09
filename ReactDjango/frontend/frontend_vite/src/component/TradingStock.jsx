import React, { useState } from 'react';
import axios from 'axios';

const Trade = () => {
  const [transactionType, setTransactionType] = useState('buy');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [duration, setDuration] = useState('day');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      transaction_type: transactionType,
      symbol: symbol.toUpperCase(),
      quantity: quantity,
      order_type: orderType,
      duration: duration,
      price: price
    };

    try {
      const response = await axios.post('http://localhost:8000/api/trading/trade/', data, {
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Transaction failed. Please try again.');
    }
  };

  return (
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
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Trade;
