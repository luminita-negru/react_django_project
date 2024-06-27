from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/stock_data/', consumers.PortofolioGet.as_asgi()),
]