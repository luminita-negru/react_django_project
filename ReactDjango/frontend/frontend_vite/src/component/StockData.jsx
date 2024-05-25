import React, { useEffect, useState } from 'react';

export function StockData({ ticker }) {
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5173/api/stock/${ticker}/`)
      .then(response => response.json())
      .then(data => setStockData(data))
      .catch(error => console.error('Error fetching stock data:', error));
  }, [ticker]);

  return (
    <div>
      <h1>Stock Data for {ticker}</h1>
      <ul>
        {Object.entries(stockData).map(([date, price]) => (
          <li key={date}>{date}: ${price}</li>
        ))}
      </ul>
    </div>
  );
}

export default StockData;
