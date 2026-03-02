from rest_framework import serializers
from .models import CustomUser


# REGISTER
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'password',
            'firstName',
            'lastName',
            'bio',
            'age',
            'gender',
            'smoking',
            'pets',
            'cleanliness_level',
            'city',
            'isOwner',
            'isUser'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user



# READ PROFILE 
class UserReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        exclude = ['password']



# UPDATE PROFILE
class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = [
            'firstName',
            'lastName',
            'bio',
            'age',
            'gender',
            'smoking',
            'pets',
            'cleanliness_level',
            'city'
        ]


# LOGIN
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)