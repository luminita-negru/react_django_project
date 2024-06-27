// src/components/StockTicker.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockTicker = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const symbols = ['BTC-USD', 'ETH-USD', 'EURUSD=X', 'GBPUSD=X', 'AAPL', 'MSFT', 'TSLA', 'AMD', 'MARA', 'GME', 'NVDA', 'INTC', 'BABA', 'F', 'NIO', 'AMZN'];
                const requests = symbols.map(symbol =>
                    axios.get(`http://localhost:8000/get_stock_data/`, { params: { symbol, period: '1d' } })
                );
                const responses = await Promise.all(requests);
                const data = responses.map(response => {
                    const { symbol, current_price } = response.data;
                    const historicalData = JSON.parse(response.data.historical_data);
                    const prices = Object.values(historicalData);
                    const newPrice = prices[prices.length - 1];
                    const oldPrice = prices[0];
                    const change = newPrice - oldPrice;
                    const percentageChange = ((change / oldPrice) * 100).toFixed(2);
                    return {
                        symbol,
                        currentPrice: current_price.toFixed(2),
                        change: change.toFixed(2),
                        percentageChange,
                    };
                });
                setStocks(data);
            } catch (error) {
                console.error('Error fetching stock data', error);
            }
        };

        fetchStockData();
    }, []);

    return (
        <div className="stock-ticker">
            <div className="ticker-wrap">
                <div className="ticker-move">
                    {stocks.map(stock => (
                        <div className="ticker-item" key={stock.symbol}>
                            <span className="stock-symbol">{stock.symbol}</span>
                            <span className="stock-price">{stock.currentPrice}</span>
                            <span className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                {stock.change >= 0 ? '▲' : '▼'} {stock.percentageChange}% ({stock.change})
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StockTicker;
