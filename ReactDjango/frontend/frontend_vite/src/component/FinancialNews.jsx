import React, { useState, useEffect } from 'react';
import axiosConfig from '../interceptors/axiosConfig';

const FinancialNews = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
    const [ticker, setTicker] = useState('AAPL');

    const fetchNews = (ticker) => {
        axiosConfig.get(`http://localhost:8000/api/financial-news/?ticker=${ticker}`)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.data;
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setNews(data.feed);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                setError(error.toString());
            });
    };

    useEffect(() => {
        fetchNews(ticker);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchNews(ticker);
    };

    return (
        <div className="container">
            <h1 className="my-4">Financial News</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        placeholder="Enter stock ticker"
                    />
                    <button type="submit" className="submit-button">Get News</button>
                </div>
            </form>
            {error && <div className="alert alert-danger">Error: {error}</div>}
            <div className="row">
                {news.map((article, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100">
                            {article.banner_image && (
                                <img src={article.banner_image} className="card-img-top" alt="Article image" />
                            )}
                            <div className="card-body">
                                <h5 className="news-title">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        {article.title}
                                    </a>
                                </h5>
                                <p className="card-text">{article.summary}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FinancialNews;
