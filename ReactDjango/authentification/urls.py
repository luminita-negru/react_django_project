from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views
from .views import RegisterView, UpdateProfileView

urlpatterns = [
     path('home/', views.HomeView.as_view(), name ='home'),
     path('logout/', views.LogoutView.as_view(), name ='logout'),
     path('register/', views.RegisterView.as_view(), name='register'),
     path('token/',
          jwt_views.TokenObtainPairView.as_view(),
         name = 'token_obtain_pair'),
     path('update_profile/', UpdateProfileView.as_view(), name='update_profile'),
     path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]      