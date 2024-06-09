from decimal import Decimal
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile, Asset, Portfolio, Transaction
from .utils import get_stock_data, calculate_market_price, calculate_limit_price, is_order_expired, get_expiry_date
from bson.decimal128 import Decimal128

class TradeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        
        transaction_type = data.get('transaction_type')
        symbol = data.get('symbol')
        quantity = int(data.get('quantity', 0))
        order_type = data.get('order_type')
        duration = data.get('duration')

        # Fetch stock data
        stock_data = get_stock_data(symbol)

        # Check if the asset exists, if not create it from yFinance data
        asset = Asset.objects.filter(symbol=symbol).first()
        if not asset:
            asset = Asset.objects.create(
                symbol=symbol,
                name=stock_data['name'],
                asset_type='Stock',  # Assuming it's a stock, you can modify this based on your needs
                last_price=Decimal(stock_data['last_price']),
                
                start_price=Decimal(stock_data['last_price']),
                buy_price=Decimal(stock_data['bid_price']),
                sell_price=Decimal(stock_data['ask_price']),
                history=[{'date': datetime.now().strftime('%Y-%m-%d'), 'price': Decimal(stock_data['last_price'])}]
            )

        # Calculate the price based on order type
        if order_type == 'market':
            price = calculate_market_price(stock_data, transaction_type)
        elif order_type == 'limit':
            price = calculate_limit_price(Decimal(data.get('price', 0)), transaction_type, stock_data)
            if price is None:
                return Response({'status': 'error', 'message': 'Invalid limit price'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch user profile
        user_profile = UserProfile.objects.filter(user=request.user).first()
        if not user_profile:
            return Response({'status': 'error', 'message': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch portfolio
        portfolio = Portfolio.objects.filter(user_profile=user_profile).first()
        if not portfolio:
            return Response({'status': 'error', 'message': 'Portfolio not found'}, status=status.HTTP_404_NOT_FOUND)

        total_cost = quantity * price

        if transaction_type == 'buy':
            if portfolio.balance.to_decimal() < total_cost:
                return Response({'status': 'error', 'message': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
            portfolio.balance = portfolio.balance.to_decimal() - Decimal(str(total_cost))
            asset_found = False
            for asset_item in portfolio.assets:
                if asset_item['symbol'] == symbol:
                    asset_item['quantity'] += quantity
                    asset_found = True
                    break
            if not asset_found:
                portfolio.assets.append({'symbol': symbol, 'quantity': quantity, 'purchase_price': price})
            portfolio.save()
        elif transaction_type == 'sell':
            asset_found = False
            for asset_item in portfolio.assets:
                if asset_item['symbol'] == symbol and asset_item['quantity'] >= quantity:
                    portfolio.balance = portfolio.balance.to_decimal() + Decimal(str(total_cost))
                    asset_item['quantity'] -= quantity
                    if asset_item['quantity'] == 0:
                        portfolio.assets.remove(asset_item)
                    asset_found = True
                    break
            if not asset_found:
                return Response({'status': 'error', 'message': 'Insufficient assets'}, status=status.HTTP_400_BAD_REQUEST)
            portfolio.save()

        # Record the transaction with expiry date
        transaction = Transaction.objects.create(
            transaction_type=transaction_type,
            portfolio=portfolio,
            asset=asset,
            quantity=quantity,
            price=price,
            confirmed=True,
            transaction_date=datetime.now(),
            expiration_date=get_expiry_date(duration)
        )

        return Response({'status': 'success', 'message': 'Transaction successful'}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        # Check for expired transactions
        user_profile = UserProfile.objects.filter(user=request.user).first()
        if not user_profile:
            return Response({'status': 'error', 'message': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

        portfolio = Portfolio.objects.filter(user_profile=user_profile).first()
        if not portfolio:
            return Response({'status': 'error', 'message': 'Portfolio not found'}, status=status.HTTP_404_NOT_FOUND)

        expired_transactions = []
        for transaction in Transaction.objects.filter(portfolio=portfolio):
            if is_order_expired(transaction.transaction_date, transaction.duration):
                expired_transactions.append(transaction)

        return Response({'expired_transactions': expired_transactions}, status=status.HTTP_200_OK)

class PortfolioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.filter(user=request.user).first()
        if not user_profile:
            return Response({'status': 'error', 'message': 'User profile not found'}, status=404)

        portfolio = Portfolio.objects.filter(user_profile=user_profile).first()
        if not portfolio:
            return Response({'status': 'error', 'message': 'Portfolio not found'}, status=404)

        assets = Asset.objects.filter(symbol__in=[item['symbol'] for item in portfolio.assets])

        data = {
            'user_profile': {
                'initial_balance': user_profile.initial_balance.to_decimal(),
                'net_worth': user_profile.net_worth.to_decimal(),
                'risk_tolerance': user_profile.risk_tolerance,
                'objective': user_profile.objective
            },
            'portfolio': {
                'portfolio_name': portfolio.portfolio_name,
                'balance': portfolio.balance.to_decimal(),
                'assets': [
                    {
                        'symbol': asset.symbol,
                        'name': asset.name,
                        'last_price': asset.last_price.to_decimal(),
                        'available_shares': asset.available_shares,
                        'buy_price': asset.buy_price.to_decimal(),
                        'sell_price': asset.sell_price.to_decimal(),
                        'quantity': next((item['quantity'] for item in portfolio.assets if item['symbol'] == asset.symbol), 0),
                        'purchase_price': next((item['purchase_price'] for item in portfolio.assets if item['symbol'] == asset.symbol), 0)
                    } for asset in assets
                ]
            }
        }
        return Response(data, status=200)
