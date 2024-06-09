from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework import generics
from trading.models import UserProfile, Portfolio

class HomeView(APIView):
     
   permission_classes = (IsAuthenticated, )
   def get(self, request):
       content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
       return Response(content)
   

class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self, request):
          
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)
          
class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        #user = User.objects.get(username=request.data['username'])
        return Response({
            'message': 'User and portfolio created successfully.'
        }, status=status.HTTP_201_CREATED)
    
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        data = request.data
        
        portfolio_name = data.get('portfolio_name')
        net_worth = data.get('net_worth')
        risk_tolerance = data.get('risk_tolerance')
        objective = data.get('objective')
        
        # Update UserProfile
        user_profile.net_worth = net_worth
        user_profile.risk_tolerance = risk_tolerance
        user_profile.objective = objective
        user_profile.save()
        
        # Create or update Portfolio
        portfolio, created = Portfolio.objects.get_or_create(user_profile=user_profile)
        portfolio.portfolio_name = portfolio_name
        portfolio.balance = user_profile.initial_balance  # Initial balance logic
        portfolio.save()
        
        return Response({'status': 'success', 'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)