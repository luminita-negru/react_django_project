import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DonatePage = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [currency, setCurrency] = useState('USD');

  const predefinedAmounts = [10, 20, 30, 60];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountToCharge = customAmount ? customAmount : amount;
    const amountInCents = amountToCharge * 100;

    try {
      const response = await axios.post('http://localhost:8000/api/checkout/', {
        amount: amountInCents,
        currency: currency.toLowerCase(),
        frequency: frequency,
      });
      const sessionId = response.data.id;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="donate-container">
      <h1>Donate to Support Us</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="form-control"
          >
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>
        </div>

        <div className="form-group">
          <label>Donation Frequency</label>
          <div className="frequency-options">
            <label>
              <input
                type="radio"
                value="one-time"
                checked={frequency === 'one-time'}
                onChange={() => setFrequency('one-time')}
              />
              One Time
            </label>
            <label>
              <input
                type="radio"
                value="monthly"
                checked={frequency === 'monthly'}
                onChange={() => setFrequency('monthly')}
              />
              Monthly
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Donation Amount</label>
          <div className="amount-options">
            {predefinedAmounts.map((amt) => (
              <button
                type="button"
                key={amt}
                className={`amount-button ${amount === amt ? 'selected' : ''}`}
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount('');
                }}
              >
                ${amt}
              </button>
            ))}
            <div className="custom-amount">
              <span>$</span>
              <input
                type="number"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('');
                }}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary submit-button">
          Donate
        </button>
      </form>
    </div>
  );
};

export default DonatePage;
