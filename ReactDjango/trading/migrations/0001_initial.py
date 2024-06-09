# Generated by Django 4.1.13 on 2024-06-01 17:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import djongo.models.fields


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Asset",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("symbol", models.CharField(max_length=10, unique=True)),
                ("name", models.CharField(max_length=100)),
                ("asset_type", models.CharField(max_length=50)),
                ("last_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("available_shares", models.IntegerField()),
                ("start_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("buy_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("sell_price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("history", djongo.models.fields.JSONField(default=list)),
            ],
        ),
        migrations.CreateModel(
            name="Portfolio",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("portfolio_name", models.CharField(max_length=100)),
                ("balance", models.DecimalField(decimal_places=2, max_digits=12)),
                ("create_date", models.DateTimeField(auto_now_add=True)),
                ("assets", djongo.models.fields.JSONField(default=list)),
            ],
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "initial_balance",
                    models.DecimalField(
                        decimal_places=2, default=10000.0, max_digits=12
                    ),
                ),
                (
                    "net_worth",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("risk_tolerance", models.CharField(max_length=50)),
                ("objective", models.CharField(max_length=100)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "transaction_type",
                    models.CharField(
                        choices=[("buy", "Buy"), ("sell", "Sell")], max_length=4
                    ),
                ),
                ("quantity", models.IntegerField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("transaction_date", models.DateTimeField(auto_now_add=True)),
                ("confirmed", models.BooleanField(default=False)),
                (
                    "asset",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="trading.asset"
                    ),
                ),
                (
                    "portfolio",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="trading.portfolio",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="portfolio",
            name="user_profile",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="trading.userprofile"
            ),
        ),
    ]