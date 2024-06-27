# utils.py
from datetime import datetime
import yfinance as yf

def get_stock_data(symbol):
    stock = yf.Ticker(symbol)
    return {
        'symbol': symbol,
        'name': stock.info.get('shortName', 'N/A'),
        'bid_price': stock.info.get('bid', "No bid price available"),
        'ask_price': stock.info.get('ask', "No bid price available"),
        'available_shares': stock.info.get('sharesOutstanding', "No data available") 
    }

def calculate_market_price(stock_data, transaction_type):
    if transaction_type == 'buy':
        return stock_data['ask_price']
    elif transaction_type == 'sell':
        return stock_data['bid_price']
    return stock_data['last_price']

def is_order_expired(order_date, duration):
    """Check if the order has expired based on its duration."""
    if duration == 'day':
        return order_date.date() < datetime.now().date()
    return False  # GTC orders do not expire automatically

def get_expiry_date(duration):
    """Calculate the expiry date of the order based on its duration."""
    if duration == 'day':
        return datetime.now().replace(hour=23, minute=59, second=59)
    return None  # GTC orders do not have a fixed expiry date
