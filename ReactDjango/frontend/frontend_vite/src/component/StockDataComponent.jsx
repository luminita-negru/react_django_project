// StockDataComponent.jsx

import React, { useEffect, useState } from 'react';

export function StockDataComponent() {
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/stock/')
            .then(response => response.json())
            .then(data => setStockData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Stock Data</h1>
            {stockData ? (
                <ul>
                    {stockData.close.map((close, index) => (
                        <li key={index}>{`Date: ${stockData.date[index]}, Close: ${close}`}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default StockDataComponent;
