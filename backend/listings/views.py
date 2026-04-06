from rest_framework import permissions, status, generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.db import transaction
from backend.api_response import api_success, api_error

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

                return api_success(
                    data=response_serializer.data,
                    message="Property listing created successfully",
                    status_code=status.HTTP_201_CREATED,
                )

        except Exception as exc:
            return api_error(
                message="Failed to create property listing.",
                status_code=status.HTTP_400_BAD_REQUEST,
                data={"details": str(exc)},
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

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_success(
            data=response.data,
            message="Property listings fetched successfully",
            status_code=response.status_code,
        )


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

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return api_success(
            data=response.data,
            message="Property listing fetched successfully",
            status_code=response.status_code,
        )

class MyPropertyListingListView(generics.ListAPIView):
    serializer_class = PropertyListingResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PropertyListing.objects.filter(
            owner=self.request.user
        ).order_by("-created_at")

    def get_serializer_context(self):
        return super().get_serializer_context()

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_success(
            data=response.data,
            message="My property listings fetched successfully",
            status_code=response.status_code,
        )

class PropertyListingUpdateView(generics.UpdateAPIView):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        response = self.update(request, *args, **kwargs)
        return api_success(
            data=response.data,
            message="Property listing updated successfully",
            status_code=response.status_code,
        )

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

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return api_success(
            data=None,
            message="Property listing deleted successfully",
            status_code=status.HTTP_200_OK,
        )