# views.py

from django.http import JsonResponse
import yfinance as yf

def get_stock_data(request):
    ticker = 'AAPL' 
    stock = yf.Ticker(ticker)
    hist = stock.history(period="5d")  

    data = {
        "date": hist.index.tolist(),
        "close": hist['Close'].tolist()
    }
    return JsonResponse(data)
