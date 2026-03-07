from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta, datetime, timezone

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
        return Response(UserReadSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        return Response({
            'refreshToken': str(refresh),
            'accessTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(hours=1)),
            'accessToken': str(refresh.access_token),
            'refreshTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(days=1))
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


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
    return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)

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
        return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        token = RefreshToken(refresh_token_str)
        return Response({
            'refreshToken': str(token),
            'accessTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(hours=1)),
            'accessToken': str(token.access_token),
            'refreshTokenExpiresAtUtc': (datetime.now(timezone.utc)+timedelta(days=1))
        }, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)


# Get current user profile
@extend_schema(
    responses=UserReadSerializer
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(UserReadSerializer(request.user).data)


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
        return Response(UserReadSerializer(request.user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    return Response(UserReadSerializer(request.user).data)