
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from channels.db import database_sync_to_async
from trading.models import Portfolio, UserProfile
import yfinance
class PortofolioGet(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else: 
            self.user = self.scope['user']

            await self.accept()
            self.keep_sending = True

            self.send_task = asyncio.create_task(self.send_portfolio_updates())

    async def disconnect(self, code):
        self.keep_sending = False
        await self.send_task

    async def receive(self):
        pass

    async def send_portfolio_updates(self):
        while self.keep_sending:

            assets, balance = await self.get_user_portfolio()
            result = []
            for asset in assets:
                ticker = yfinance.Ticker(asset['symbol'])
                hist = ticker.history(interval='1m', period='1d')
                close_price = hist['Close'].iloc[-1]

                result.append({"symbol": asset['symbol'],
                    "last_price": close_price,
                    "quantity": asset['quantity']
                })
            await self.send(text_data=json.dumps({"assets": result, "balance": str(balance)}))
            await asyncio.sleep(30)

    @database_sync_to_async
    def get_user_portfolio(self):
        up = UserProfile.objects.get(user_id=self.user.id)
        portfolio = Portfolio.objects.get(user_profile_id=up.id)
        return portfolio.assets, portfolio.balance
