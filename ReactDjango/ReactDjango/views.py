# stocks/views.py
from django.http import JsonResponse
from django.conf import settings
import yfinance as yf
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import io
import json
import base64
import requests


def get_stock_data(request):
    symbol = request.GET.get('symbol')
    period = request.GET.get('period', '1d')  # Default to daily if not provided
    if not symbol:
        return JsonResponse({'error': 'No stock symbol provided'}, status=400)
    
    try:
        stock = yf.Ticker(symbol)
        if period == '1d':
            data = stock.history(period='1d', interval='1m')
        
        elif period == '1mo':
            data = stock.history(period='1mo')
        else:
            # Assume period is a specific month in the format YYYY-MM
            start_date = datetime.strptime(period, '%Y-%m')
            end_date = start_date + timedelta(days=30)
            data = stock.history(start=start_date, end=end_date)
        current_price = stock.history(period='1d')['Close'].iloc[-1]
        print(data.index.tz)
        return JsonResponse({
            'symbol': symbol,
            'current_price': current_price,
            'historical_data': data['Close'].to_json()
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_financial_news(request):
    api_key = settings.ALPHA_VANTAGE_API_KEY
    ticker = request.GET.get('ticker', 'AAPL')  # Default to AAPL if no ticker is provided
    url = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={ticker}&apikey={api_key}'

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        data = response.json()
        
        # Check if the response contains the expected data
        if "feed" not in data:
            return JsonResponse({'error': 'Unexpected response structure'}, status=500)
        
        return JsonResponse(data, safe=False)
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)
    except ValueError as e:
        return JsonResponse({'error': 'Invalid response format'}, status=500)
    

