# utils.py
from datetime import datetime
import yfinance as yf

def get_stock_data(symbol):
    stock = yf.Ticker(symbol)
    history = stock.history(period='1d')
    last_close_price = history['Close'][0]
    return {
        'symbol': symbol,
        'name': stock.info.get('shortName', 'N/A'),
        'last_price': last_close_price,
        'bid_price': stock.info.get('bid', last_close_price * 0.99),
        'ask_price': stock.info.get('ask', last_close_price * 1.01),
        'available_shares': 1000  
    }

def calculate_market_price(stock_data, transaction_type):
    if transaction_type == 'buy':
        return stock_data['ask_price']
    elif transaction_type == 'sell':
        return stock_data['bid_price']
    return stock_data['last_price']

def calculate_limit_price(order_price, transaction_type, stock_data):
    if transaction_type == 'buy' and order_price >= stock_data['ask_price']:
        return order_price
    elif transaction_type == 'sell' and order_price <= stock_data['bid_price']:
        return order_price
    return None  # Invalid limit price

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
