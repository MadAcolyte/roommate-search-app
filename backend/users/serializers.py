from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'firstName', 'lastName', 'bio', 
            'age', 'gender', 'smoking', 'pets', 'cleanliness_level', 'city', 'isOwner', 'isUser'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Get password for validation
        password = validated_data.pop('password')

        # Create user with all data
        user = CustomUser(**validated_data)

        # Set password
        user.set_password(password)
        user.save()
        return user