# stocks/views.py
from django.http import JsonResponse
from django.core.mail import send_mail
from rest_framework.parsers import JSONParser
from django.conf import settings
import yfinance as yf
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import io
import json
import base64
import requests
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import stripe


def get_stock_data(request):
    symbol = request.GET.get('symbol')
    period = request.GET.get('period', '1d')
    start_date = request.GET.get('start')
    end_date = request.GET.get('end')

    if not symbol:
        return JsonResponse({'error': 'No stock symbol provided'}, status=400)

    try:
        stock = yf.Ticker(symbol)
        if period == '1d':
            data = stock.history(period='1d', interval='1m')
        elif period == '1mo':
            data = stock.history(period='1mo')
        elif period == '1y':
            data = stock.history(period='1y')
        elif period == '5y':
            data = stock.history(period='5y')
        elif period == 'custom':
            if not start_date or not end_date:
                return JsonResponse({'error': 'Custom period requires start_date and end_date'}, status=400)
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
            data = stock.history(start=start_date, end=end_date)
        else:
            return JsonResponse({'error': 'Invalid period specified'}, status=400)
        
        current_price = stock.history(period='1d')['Close'].iloc[-1]
        info = stock.info

        return JsonResponse({
            'symbol': symbol,
            'current_price': current_price,
            'historical_data': data['Close'].to_json(),
            'info': {
                'market_cap': info.get('marketCap'),
                'eps': info.get('trailingEps'),
                'dividend_yield': info.get('dividendYield'),
                'pe_ratio': info.get('trailingPE'),
                '52_week_high': info.get('fiftyTwoWeekHigh'),
                '52_week_low': info.get('fiftyTwoWeekLow'),
                'volume': info.get('volume'),
                'day_high': info.get('dayHigh'),
                'day_low': info.get('dayLow')
            }
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
    
@csrf_exempt
def contact_view(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        full_message = f"Message from {name} ({email}):\n\n{message}"

        try:
            send_mail(subject, full_message,  settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER])
            return JsonResponse({'message': 'Your message has been sent successfully!'}, status=200)
        except Exception as e:
            return JsonResponse({'message': f'Failed to send your message. Please try again. {e}'}, status=500)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)
    

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_checkout_session(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': data['currency'],
                        'product_data': {
                            'name': 'Donation',
                        },
                        'unit_amount': data['amount'],
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='http://localhost:5173/success',
                cancel_url='http://localhost:5173/cancel',
            )
            return JsonResponse({'id': session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=403)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)