from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework import serializers

from .models import CustomUser
from .serializers import UserCreateSerializer, UserReadSerializer, LoginSerializer, UserUpdateSerializer


class TokenSerializer(serializers.Serializer):
    token = serializers.CharField()


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


# Register
@extend_schema(
    request=UserCreateSerializer,
    responses=UserReadSerializer
)
@api_view(['POST'])
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
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# Logout
@extend_schema(
    responses=MessageSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Get user profile
@extend_schema(
    responses=UserReadSerializer
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response(UserReadSerializer(request.user).data)


# Update user profile
@extend_schema(
    request=UserUpdateSerializer,
    responses=UserReadSerializer
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(UserReadSerializer(request.user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)