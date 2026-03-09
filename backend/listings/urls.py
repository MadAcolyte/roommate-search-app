from django.urls import path
from .views import (
    PropertyListingCreateView,
    PropertyListingListView,
    PropertyListingDetailView,
    PropertyListingUpdateView,
    PropertyListingDeleteView,
    MyPropertyListingListView
)

urlpatterns = [
    path("property-listings/", PropertyListingListView.as_view(), name="property-listing-list"),
    path("property-listings/create/", PropertyListingCreateView.as_view(), name="property-listing-create"),
    path("property-listings/<uuid:id>/", PropertyListingDetailView.as_view(), name="property-listing-detail"),
    path("property-listings/<uuid:id>/update/", PropertyListingUpdateView.as_view(), name="property-listing-update"),
    path("property-listings/<uuid:id>/delete/", PropertyListingDeleteView.as_view(), name="property-listing-delete"),
    path("my-listings/", MyPropertyListingListView.as_view(), name="my-listings"),
]

