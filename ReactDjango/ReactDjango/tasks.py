# your_app_name/tasks.py
from decimal import Decimal
from celery import shared_task
from trading.models import Transaction, Portfolio
import yfinance
from django.utils import timezone

@shared_task
def limit_orders_check():
    cache = {}
    for transaction in Transaction.objects.all():
        if transaction.state == 'pending':
            transaction.price = transaction.price.to_decimal()
            if transaction.expiration_date is not None and transaction.expiration_date < timezone.now():
                transaction.state = 'cancelled'
                transaction.save()
                continue
            if transaction.symbol not in cache:
                ticker = yfinance.Ticker(transaction.symbol)
                cache = {transaction.symbol: 
                    [ticker.info.get('bid'),
                    ticker.info.get('ask')]
                }
            portfolio = transaction.portfolio

            if transaction.transaction_type == 'buy':
                price = min(transaction.price, cache[transaction.symbol][0])
                if portfolio.balance.to_decimal() < Decimal(str(price * transaction.quantity)):
                    continue
                if transaction.price > price or cache[transaction.symbol][1] == price:
                    portfolio.balance = portfolio.balance.to_decimal() - Decimal(str(price * transaction.quantity))
                    asset_item = list(filter(lambda x: x['symbol'] == transaction.symbol, portfolio.assets))
                    if len(asset_item) > 0:
                        asset_item[0]['quantity'] += transaction.quantity
                    else:
                        portfolio.assets.append({'symbol': transaction.symbol, 'quantity': transaction.quantity})
                    portfolio.save()
                transaction.state = 'completed'
                transaction.save()
            elif transaction.transaction_type == 'sell':
                price = max(transaction.price, cache[transaction.symbol][1])
                asset_item = list(filter(lambda x: x['symbol'] == transaction.symbol, portfolio.assets))
                if  len(asset_item) > 0 and asset_item[0]['quantity'] >= transaction.quantity and (price > transaction.price or price == cache[transaction.symbol][1]):
                    asset_item[0]['quantity'] -= transaction.quantity
                    portfolio.balance = portfolio.balance.to_decimal() + Decimal(str(transaction.quantity * price))
                    portfolio.save()
                else:
                    continue

@shared_task
def save_user_performance():
    for portfolio in Portfolio.objects.all():
        portfolio_value = 0
        for asset in portfolio.assets:
            ticker = yfinance.Ticker(asset['symbol'])
            price = ticker.history(period='1d')['Close'].iloc[-1]
            portfolio_value += price * asset['quantity']
        portfolio_value = Decimal(str(portfolio_value)) + portfolio.balance.to_decimal()
        entry = {
            'timestamp': timezone.now(),
            'value': str(portfolio_value)
        }
        if portfolio.history is None:
            portfolio.history = []
        portfolio.history.append(entry)
        portfolio.balance = portfolio.balance.to_decimal()
        portfolio.save()