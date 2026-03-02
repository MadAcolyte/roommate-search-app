from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser

class AuthTests(APITestCase):

    def test_register_login_get_logout(self):
        # 1. Register
        register_data = {
            "username": "janek",
            "email": "janek@example.com",
            "password": "tajnehaslo",
            "firstName": "Jan",
            "lastName": "Kowalski",
            "city": "Warsaw"
        }
        response = self.client.post("/api/register/", register_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "janek")

        # 2. Login
        login_data = {
            "username": "janek",
            "password": "tajnehaslo"
        }
        response = self.client.post("/api/login/", login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data["token"]

        # 3. Get profile info
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        response = self.client.get("/api/get_user/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "janek@example.com")

        # 4. Logout
        response = self.client.post("/api/logout/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
