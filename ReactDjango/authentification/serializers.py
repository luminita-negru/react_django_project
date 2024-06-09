from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from trading.models import UserProfile, Portfolio

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    portfolio_name = serializers.CharField(write_only=True)
    net_worth = serializers.DecimalField(max_digits=12, decimal_places=2, write_only=True)
    risk_tolerance = serializers.CharField(max_length=50, write_only=True)
    objective = serializers.CharField(max_length=100, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'portfolio_name', 'net_worth', 'risk_tolerance', 'objective')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        print("HERE")
        for profile in UserProfile.objects.all():
            print(profile) 
        portfolio_name = validated_data.pop('portfolio_name')
        net_worth = validated_data.pop('net_worth')
        risk_tolerance = validated_data.pop('risk_tolerance')
        objective = validated_data.pop('objective')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()
        print(user, net_worth, risk_tolerance, objective)
        print(UserProfile.objects.filter(user=user))
        # Create the user profile
        user_profile = UserProfile.objects.create(
            user=user,
            initial_balance=10000.00,
            net_worth=net_worth,
            risk_tolerance=risk_tolerance,
            objective=objective
        )
        user_profile.save()
        # Create the portfolio
        Portfolio.objects.create(
            user_profile=user_profile,
            portfolio_name=portfolio_name,
            balance=user_profile.initial_balance
        )

        return user
