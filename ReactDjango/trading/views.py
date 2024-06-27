from decimal import Decimal
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile, Asset, Portfolio, Transaction
from .utils import get_stock_data, calculate_market_price, is_order_expired, get_expiry_date
from bson.decimal128 import Decimal128

class TradeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        
        transaction_type = data.get('transaction_type')
        price_by_user = data.get('price', 0)
        price_by_user = float(price_by_user) if price_by_user != '' else 0
        symbol = data.get('symbol')
        quantity = int(data.get('quantity', 0))
        if quantity == 0:
            return Response({'status': 'error', 'message': 'No quantity selected'}, status=status.HTTP_400_BAD_REQUEST)

        order_type = data.get('order_type')
        duration = data.get('duration')

        # Fetch stock data
        stock_data = get_stock_data(symbol)
       
        # Calculate the price based on order type
        price = calculate_market_price(stock_data, transaction_type)

        # Fetch user profile
        user_profile = UserProfile.objects.filter(user=request.user).first()
        if not user_profile:
            return Response({'status': 'error', 'message': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch portfolio
        portfolio = Portfolio.objects.filter(user_profile=user_profile).first()
        if not portfolio:
            return Response({'status': 'error', 'message': 'Portfolio not found'}, status=status.HTTP_404_NOT_FOUND)


        if order_type == 'market':
            total_price = quantity * price

            if transaction_type == 'buy':
                if portfolio.balance.to_decimal() < total_price:
                    return Response({'status': 'error', 'message': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
                portfolio.balance = portfolio.balance.to_decimal() - Decimal(str(total_price))
                asset_item = list(filter(lambda x: x['symbol'] == symbol, portfolio.assets))
                if len(asset_item) > 0:
                    asset_item[0]['quantity'] += quantity
                else:
                    portfolio.assets.append({'symbol': symbol, 'quantity': quantity, 'purchase_price': price})
                portfolio.save()
            elif transaction_type == 'sell':
                asset_item = list(filter(lambda x: x['symbol'] == symbol, portfolio.assets))
                if  len(asset_item) >0 and asset_item[0]['quantity'] >= quantity:
                    asset_item[0]['quantity'] -= quantity
                else:
                    return Response({'status': 'error', 'message': 'Insufficient assets'}, status=status.HTTP_400_BAD_REQUEST)
                portfolio.balance = portfolio.balance.to_decimal() + Decimal(str(total_price))
                portfolio.save()
            
            transaction = Transaction.objects.create(
                transaction_type=transaction_type,
                portfolio=portfolio,
                quantity=quantity,
                symbol=symbol,
                price=price,
                state='completed',
                transaction_date=datetime.now(),
            )
        elif order_type == 'limit':
            state = 'pending'
            if transaction_type == 'buy':
                total_price = quantity * min(price_by_user, price)

                if price <= price_by_user and portfolio.balance.to_decimal() >= total_price:
                    portfolio.balance = portfolio.balance.to_decimal() - Decimal(str(total_price))
                    asset_item = list(filter(lambda x: x['symbol'] == symbol, portfolio.assets))
                    if len(asset_item)>0:
                        asset_item[0]['quantity'] += quantity
                    else:
                        portfolio.assets.append({'symbol': symbol, 'quantity': quantity})
                    portfolio.save()
                    state='completed'
                    price_by_user = price

            elif transaction_type == 'sell':
                total_price = quantity * max(price_by_user, price)
                asset_item = list(filter(lambda x: x['symbol'] == symbol, portfolio.assets))
                if  len(asset_item) > 0 and asset_item[0]['quantity'] >= quantity and price >= price_by_user:
                    asset_item[0]['quantity'] -= quantity
                    state = 'completed'
                    portfolio.balance = portfolio.balance.to_decimal() + Decimal(str(total_price))
                    portfolio.save()
                    price_by_user = price
            
            transaction = Transaction.objects.create(
                transaction_type=transaction_type,
                portfolio=portfolio,
                quantity=quantity,
                price=price_by_user,
                symbol=symbol,
                state=state,
                transaction_date=datetime.now(),
                expiration_date=get_expiry_date(duration)
            )
        return Response({'status': 'success', 'message': 'Transaction successful'}, status=status.HTTP_200_OK)

   
class PortfolioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.filter(user=request.user).first()
        if not user_profile:
            return Response({'status': 'error', 'message': 'User profile not found'}, status=404)

        portfolio = Portfolio.objects.filter(user_profile=user_profile).first()
        if not portfolio:
            return Response({'status': 'error', 'message': 'Portfolio not found'}, status=404)

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
                'assets': portfolio.assets,
                'history': portfolio.history
            }
        }
        return Response(data, status=200)
