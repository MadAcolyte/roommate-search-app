from rest_framework import permissions, status, generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction

from .models import PropertyListing, PropertyListingImage
from .serializers import (
    PropertyListingCreateSerializer,
    PropertyListingResponseSerializer,
)
from .validators import validate_uploaded_images
from django.db.models import Q

class PropertyListingCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        images = request.FILES.getlist("images")

        serializer = PropertyListingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validate_uploaded_images(images)

        try:
            with transaction.atomic():
                listing = serializer.save(owner=request.user)

                for image in images:
                    PropertyListingImage.objects.create(
                        listing=listing,
                        image=image
                    )

                response_serializer = PropertyListingResponseSerializer(
                    listing,
                    context={"request": request}
                )

                return Response(
                    response_serializer.data,
                    status=status.HTTP_201_CREATED
                )

        except Exception as exc:
            return Response(
                {
                    "message": "Failed to create property listing.",
                    "details": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class PropertyListingListView(generics.ListAPIView):

    serializer_class = PropertyListingResponseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return PropertyListing.objects.filter(
            visibility=True
        ).order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}


class PropertyListingDetailView(generics.RetrieveAPIView):
    serializer_class = PropertyListingResponseSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return PropertyListing.objects.filter(
                Q(visibility=True) | Q(owner=user)
            )

        return PropertyListing.objects.filter(visibility=True)

    def get_serializer_context(self):
        return super().get_serializer_context()

class MyPropertyListingListView(generics.ListAPIView):
    serializer_class = PropertyListingResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PropertyListing.objects.filter(
            owner=self.request.user
        ).order_by("-created_at")

    def get_serializer_context(self):
        return super().get_serializer_context()

class PropertyListingUpdateView(generics.UpdateAPIView):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def perform_update(self, serializer):
        listing = self.get_object()
        if listing.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own listings.")
        serializer.save()


class PropertyListingDeleteView(generics.DestroyAPIView):
    queryset = PropertyListing.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own listings.")
        instance.delete()