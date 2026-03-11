from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from listings.models import PropertyListing, GenderPreference
from decimal import Decimal
import random

User = get_user_model()

MOCK_LISTINGS = [
    {
        "price": Decimal("850.00"),
        "address": "123 Main Street, Apt 4B",
        "city": "New York",
        "description": "Cozy apartment in the heart of Manhattan. Close to subway, restaurants, and nightlife. Looking for a clean, respectful roommate who enjoys a quiet environment during weekdays.",
        "area": Decimal("750.00"),
        "roommates_count": 2,
        "roommates_looking_for_number": 1,
        "total_rooms": 3,
        "gender_preference": GenderPreference.ALL,
        "smoking": False,
        "pets": True,
    },
    {
        "price": Decimal("1200.00"),
        "address": "456 Oak Avenue, Unit 12",
        "city": "Los Angeles",
        "description": "Spacious modern apartment with stunning city views. Fully furnished common areas, in-unit laundry, and parking included. Perfect for young professionals.",
        "area": Decimal("1100.00"),
        "roommates_count": 1,
        "roommates_looking_for_number": 2,
        "total_rooms": 4,
        "gender_preference": GenderPreference.ALL,
        "smoking": False,
        "pets": False,
    },
    {
        "price": Decimal("650.00"),
        "address": "789 College Road",
        "city": "Boston",
        "description": "Student-friendly housing near campus. Utilities included! Great for grad students or young professionals. Quiet study environment with social common areas.",
        "area": Decimal("500.00"),
        "roommates_count": 3,
        "roommates_looking_for_number": 1,
        "total_rooms": 4,
        "gender_preference": GenderPreference.GIRLS,
        "smoking": False,
        "pets": False,
    },
    {
        "price": Decimal("900.00"),
        "address": "321 Riverside Drive",
        "city": "Chicago",
        "description": "Beautiful brownstone with original hardwood floors and exposed brick. Walking distance to the lake. Looking for someone who appreciates art and good conversation.",
        "area": Decimal("850.00"),
        "roommates_count": 1,
        "roommates_looking_for_number": 1,
        "total_rooms": 2,
        "gender_preference": GenderPreference.ALL,
        "smoking": True,
        "pets": True,
    },
    {
        "price": Decimal("550.00"),
        "address": "555 Pine Street, Apt 2A",
        "city": "Austin",
        "description": "Affordable room in a vibrant neighborhood. Close to live music venues and great food trucks. Looking for an easygoing roommate who loves Austin culture!",
        "area": Decimal("600.00"),
        "roommates_count": 2,
        "roommates_looking_for_number": 1,
        "total_rooms": 3,
        "gender_preference": GenderPreference.BOYS,
        "smoking": True,
        "pets": True,
    },
    {
        "price": Decimal("1500.00"),
        "address": "100 Tech Boulevard, Penthouse",
        "city": "San Francisco",
        "description": "Luxury high-rise with gym, pool, and rooftop access. Smart home features throughout. Ideal for tech professionals. No parties, respectful neighbors appreciated.",
        "area": Decimal("1400.00"),
        "roommates_count": 1,
        "roommates_looking_for_number": 1,
        "total_rooms": 3,
        "gender_preference": GenderPreference.ALL,
        "smoking": False,
        "pets": False,
    },
    {
        "price": Decimal("700.00"),
        "address": "222 Beach Road",
        "city": "Miami",
        "description": "Steps from the beach! Bright and airy apartment with ocean breeze. Perfect for beach lovers and outdoor enthusiasts. Surfboard storage available.",
        "area": Decimal("680.00"),
        "roommates_count": 2,
        "roommates_looking_for_number": 1,
        "total_rooms": 3,
        "gender_preference": GenderPreference.ALL,
        "smoking": False,
        "pets": True,
    },
    {
        "price": Decimal("475.00"),
        "address": "888 University Ave",
        "city": "Seattle",
        "description": "Budget-friendly room in a shared house. Great for students or anyone starting out. Communal kitchen and living room. Friendly household with regular game nights!",
        "area": Decimal("400.00"),
        "roommates_count": 4,
        "roommates_looking_for_number": 1,
        "total_rooms": 5,
        "gender_preference": GenderPreference.ALL,
        "smoking": False,
        "pets": True,
    },
]


class Command(BaseCommand):
    help = "Seed the database with mock property listings"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing listings before seeding",
        )

    def handle(self, *args, **options):
        # Get or create a test user to own the listings
        test_user, created = User.objects.get_or_create(
            username="testowner",
            defaults={
                "email": "testowner@example.com",
                "firstName": "Test",
                "lastName": "Owner",
                "city": "New York",
            }
        )
        if created:
            test_user.set_password("testpass123")
            test_user.save()
            self.stdout.write(self.style.SUCCESS(f"Created test user: testowner"))
        else:
            self.stdout.write(f"Using existing user: testowner")

        if options["clear"]:
            deleted_count, _ = PropertyListing.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted_count} existing listings"))

        created_count = 0
        for listing_data in MOCK_LISTINGS:
            listing = PropertyListing.objects.create(
                owner=test_user,
                **listing_data
            )
            created_count += 1
            self.stdout.write(f"  Created: {listing.city} - {listing.address}")

        self.stdout.write(
            self.style.SUCCESS(f"\nSuccessfully created {created_count} mock listings!")
        )
        self.stdout.write(
            f"\nYou can now view them at: http://localhost:5173/listings"
        )
