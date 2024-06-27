# models.py in trading app
from djongo import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    initial_balance = models.DecimalField(max_digits=12, decimal_places=2, default=10000.00)
    net_worth = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    risk_tolerance = models.CharField(max_length=50)
    objective = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username

class Asset(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=50)
    last_price = models.DecimalField(max_digits=10, decimal_places=2)
    available_shares = models.IntegerField()
    start_price = models.DecimalField(max_digits=10, decimal_places=2)
    buy_price = models.DecimalField(max_digits=10, decimal_places=2)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2)
    history = models.JSONField(default=list)

class Portfolio(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    portfolio_name = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=12, decimal_places=2)
    create_date = models.DateTimeField(auto_now_add=True)
    assets = models.JSONField(default=list)
    history = models.JSONField(default=list)

class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
    ]
    TRANSATION_STATE = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPE_CHOICES)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=12, choices=TRANSATION_STATE, default='pending')
    expiration_date = models.DateTimeField(null=True, blank=True)  # Add this field

    def __str__(self):
        return f"{self.transaction_type} {self.quantity} of {self.symbol} at {self.price}"
