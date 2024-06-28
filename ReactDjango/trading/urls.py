from django.urls import path
from .views import TradeView, PortfolioView

urlpatterns = [
    path('trade/', TradeView.as_view(), name='trade'),
    path('trade/<str:transaction_id>/', TradeView.as_view(), name='delete-transaction'),
    path('portfolio/', PortfolioView.as_view(), name='portfolio')
]
