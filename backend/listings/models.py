from django.db import models
import uuid
from django.conf import settings

# Create your models here.

import uuid
from django.conf import settings
from django.db import models


class GenderPreference(models.TextChoices):
    GIRLS = "GIRLS", "Girls"
    BOYS = "BOYS", "Boys"
    ALL = "ALL", "All"

class PropertyListing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="property_listings"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    description = models.TextField()
    area = models.DecimalField(max_digits=8, decimal_places=2)
    roommates_count = models.PositiveIntegerField()
    roommates_looking_for_number=models.PositiveIntegerField()
    total_rooms = models.PositiveIntegerField()
    gender_preference = models.CharField(
        max_length=10,
        choices=GenderPreference.choices,
        default=GenderPreference.ALL
    )
    smoking = models.BooleanField(default=False)
    pets = models.BooleanField(default=False)
    visibility = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "property_listings"

    def __str__(self):
        return f"{self.city} - {self.address}"


class PropertyListingImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(
        PropertyListing,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="listing_images/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "property_listing_images"

    def __str__(self):
        return self.image.name