from .views import register_user, user_login, user_logout, get_current_user, update_user_data, change_password
from django.urls import path

urlpatterns = [
    path('api/auth/register', register_user, name='register'),
    path('api/auth/login', user_login, name='login'),
    path('api/auth/logout', user_logout, name='logout'),
    path('api/auth/change_password', change_password, name='change_password'),
    path('api/user/get_user', get_current_user, name='user_info'),
    path('api/user/update_user', update_user_data, name='update_user')
]