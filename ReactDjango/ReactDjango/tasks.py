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
                market_price = cache[transaction.symbol][1]
                print(market_price, transaction.price)
                if market_price > transaction.price:
                    continue
                
                portfolio.balance = portfolio.balance.to_decimal() - Decimal(str(market_price * transaction.quantity))
                asset_item = list(filter(lambda x: x['symbol'] == transaction.symbol, portfolio.assets))
                if len(asset_item) > 0:
                    asset_item[0]['quantity'] += transaction.quantity
                else:
                    portfolio.assets.append({'symbol': transaction.symbol, 'quantity': transaction.quantity})
                portfolio.save()
                transaction.price = market_price
                transaction.state = 'completed'
                transaction.save()
            elif transaction.transaction_type == 'sell':
                market_price = cache[transaction.symbol][0]
                if market_price < transaction.price:
                    continue
                asset_item = list(filter(lambda x: x['symbol'] == transaction.symbol, portfolio.assets))
                if  len(asset_item) > 0 and asset_item[0]['quantity'] >= transaction.quantity:
                    asset_item[0]['quantity'] -= transaction.quantity
                    portfolio.balance = portfolio.balance.to_decimal() + Decimal(str(transaction.quantity * market_price))
                    portfolio.save()
                    transaction.price = market_price
                    transaction.state = 'completed'
                    transaction.save()


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