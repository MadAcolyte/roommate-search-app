from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta, datetime, timezone
from backend.api_response import api_success, api_error

from .models import CustomUser
from .serializers import UserCreateSerializer, UserReadSerializer, LoginSerializer, UserUpdateSerializer, ChangePasswordSerializer


class TokenSerializer(serializers.Serializer):
    refreshToken = serializers.CharField()
    accessToken = serializers.CharField()
    accessTokenExpiresAtUtc = serializers.CharField()
    refreshTokenExpiresAtUtc = serializers.CharField()

class RefreshTokenSerialzer(serializers.Serializer):
    refreshToken = serializers.CharField()


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


# Register
@extend_schema(
    request=UserCreateSerializer,
    responses=UserReadSerializer
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return api_success(
            data=UserReadSerializer(user).data,
            message="User registered successfully",
            status_code=status.HTTP_201_CREATED,
        )
    return api_error(
        message="Failed to register user",
        status_code=status.HTTP_400_BAD_REQUEST,
        data=serializer.errors,
    )


# Login
@extend_schema(
    request=LoginSerializer,
    responses=TokenSerializer
)
@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = None
    if username and password:
        if '@' in username:
            try:
                user_obj = CustomUser.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                user = None
        else:
            user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return api_success(
            data={
                'refreshToken': str(refresh),
                'accessTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(hours=1)),
                'accessToken': str(refresh.access_token),
                'refreshTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(days=1))
            },
            message="Logged in successfully",
            status_code=status.HTTP_200_OK,
        )

    return api_error(
        message='Invalid credentials',
        status_code=status.HTTP_401_UNAUTHORIZED,
        data=None,
    )


# Logout
@extend_schema(
    responses=MessageSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    refresh_token = request.data.get("refreshToken")
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass 
    return api_success(
        data=None,
        message='Successfully logged out.',
        status_code=status.HTTP_200_OK,
    )

# Get refresh token

@extend_schema(
    request=RefreshTokenSerialzer,  # contains old refresh token
    responses=TokenSerializer  # returns new tokens
)
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_access_token(request):
    refresh_token_str = request.data.get("refreshToken")
    if not refresh_token_str:
        return api_error(
            message='Refresh token required',
            status_code=status.HTTP_400_BAD_REQUEST,
            data=None,
        )
    
    try:
        token = RefreshToken(refresh_token_str)
        return api_success(
            data={
                'refreshToken': str(token),
                'accessTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(hours=1)),
                'accessToken': str(token.access_token),
                'refreshTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(days=1))
            },
            message='Access token refreshed successfully',
            status_code=status.HTTP_200_OK,
        )
    except Exception:
        return api_error(
            message='Invalid token',
            status_code=status.HTTP_401_UNAUTHORIZED,
            data=None,
        )


# Get current user profile
@extend_schema(
    responses=UserReadSerializer
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return api_success(
        data=UserReadSerializer(request.user).data,
        message='User fetched successfully',
        status_code=status.HTTP_200_OK,
    )


# Update user profile
@extend_schema(
    request=UserUpdateSerializer,
    responses=UserReadSerializer
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_data(request):
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return api_success(
            data=UserReadSerializer(request.user).data,
            message='User updated successfully',
            status_code=status.HTTP_200_OK,
        )
    return api_error(
        message='Failed to update user',
        status_code=status.HTTP_400_BAD_REQUEST,
        data=serializer.errors,
    )

# Change password

@extend_schema(
    request=ChangePasswordSerializer,
    responses=UserReadSerializer
)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(
        instance=request.user,
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return api_success(
        data=UserReadSerializer(request.user).data,
        message='Password changed successfully',
        status_code=status.HTTP_200_OK,
    )