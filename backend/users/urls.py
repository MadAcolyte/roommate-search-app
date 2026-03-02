from .views import register_user, user_login, user_logout, get_user
from django.urls import path

urlpatterns = [
    path('api/register/', register_user, name='register'),
    path('api/login/', user_login, name='login'),
    path('api/logout/', user_logout, name='logout'),
    path('api/get_user/', get_user, name='user_info')
]