from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    bio = models.TextField(null=True, blank=True)
    age = models.IntegerField(null=True, blank= True)
    gender = models.CharField(max_length=10, choices=[('M','Male'),('F','Female'),('O','Other')], null=True, blank=True)
    smoking = models.BooleanField(default=False)
    pets = models.BooleanField(default=False)
    cleanliness_level = models.IntegerField(default=3)
    city = models.CharField(max_length=50)

    def __str__(self):
        return self.username