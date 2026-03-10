from rest_framework import serializers
from .models import PropertyListing, PropertyListingImage


class PropertyListingImageSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = PropertyListingImage
        fields = ["id", "imageUrl", "createdAt"]

    def get_imageUrl(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None


class PropertyListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyListing
        fields = [
            "price",
            "address",
            "city",
            "description",
            "area",
            "roommates_count",
            "roommates_looking_for_number",
            "total_rooms",
            "gender_preference",
            "smoking",
            "pets",
            "visibility",
        ]
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")

        if value > 10000:
            raise serializers.ValidationError("Price cannot be greater than 10,000.")

        return value

    def validate(self, attrs):
        roommates_count = attrs.get(
            "roommates_count",
            getattr(self.instance, "roommates_count", None)
        )
        roommates_looking_for_number = attrs.get(
        "roommates_looking_for_number",
        getattr(self.instance, "roommates_looking_for_number", None)
        )
        total_rooms = attrs.get(
        "total_rooms",
        getattr(self.instance, "total_rooms", None)
        )

        if roommates_count is not None and total_rooms is not None:
            if roommates_count > total_rooms:
                raise serializers.ValidationError({
                "roommates_count": "roommates_count cannot be greater than total_rooms."
            })

        if roommates_looking_for_number is not None and total_rooms is not None:
            if roommates_looking_for_number > total_rooms:
                raise serializers.ValidationError({
                "roommates_looking_for_number": "roommates_looking_for_number cannot be greater than total_rooms."
                })
        if total_rooms <= 0:
            raise serializers.ValidationError({ "total_rooms": "total_rooms must be greater than 0."
            })
        return attrs


class PropertyListingResponseSerializer(serializers.ModelSerializer):
    ownerId = serializers.IntegerField(source="owner.id", read_only=True)
    roommatesCount = serializers.IntegerField(source="roommates_count", read_only=True)
    roommatesLookingForNumber = serializers.IntegerField(
        source="roommates_looking_for_number",
        read_only=True
    )
    totalRooms = serializers.IntegerField(source="total_rooms", read_only=True)
    genderPreference = serializers.CharField(source="gender_preference", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    images = PropertyListingImageSerializer(many=True, read_only=True)

    class Meta:
        model = PropertyListing
        fields = [
            "id",
            "ownerId",
            "price",
            "address",
            "city",
            "description",
            "area",
            "roommatesCount",
            "roommatesLookingForNumber",
            "totalRooms",
            "genderPreference",
            "smoking",
            "pets",
            "visibility",
            "createdAt",
            "updatedAt",
            "images",
        ]