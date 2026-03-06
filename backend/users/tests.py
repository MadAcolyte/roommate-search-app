from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser

class AuthEndpointTests(APITestCase):

    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "TestPass123!",
            "firstName": "Test",
            "lastName": "User",
            "bio": "Test bio",
            "age": 30,
            "gender": "M",
            "smoking": False,
            "pets": False,
            "cleanliness_level": 7,
            "city": "Vilnius",
            "isOwner": False,
            "isUser": True
        }

    def test_register_user(self):
        try:
            register_data = self.user_data.copy()
            register_data["password_confirm"] = register_data["password"]
            response = self.client.post("/api/auth/register", register_data, format="json")
            assert response.status_code == status.HTTP_201_CREATED
            assert response.data["username"] == self.user_data["username"]
            print("REGISTER: OK")
        except Exception as e:
            print("REGISTER: ERROR", e)
            raise

    def test_user_login(self):
        CustomUser.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )
        login_data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"]
        }
        try:
            response = self.client.post("/api/auth/login", login_data, format="json")
            assert response.status_code == status.HTTP_200_OK
            assert "access" in response.data
            self.access_token = response.data["access"]
            self.refresh_token = response.data["refresh"]
            print("LOGIN: OK")
        except Exception as e:
            print("LOGIN: ERROR", e)
            raise

    def test_get_current_user(self):
        user = CustomUser.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )
        self.client.force_authenticate(user=user)
        try:
            response = self.client.get("/api/user/get_user")
            assert response.status_code == status.HTTP_200_OK
            assert response.data["username"] == user.username
            print("GET USER: OK")
        except Exception as e:
            print("GET USER: ERROR", e)
            raise

    def test_update_user_data(self):
        user = CustomUser.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )
        self.client.force_authenticate(user=user)
        update_data = {"bio": "Updated bio"}
        try:
            response = self.client.put("/api/user/update_user", update_data, format="json")
            assert response.status_code == status.HTTP_200_OK
            assert response.data["bio"] == "Updated bio"
            print("UPDATE USER: OK")
        except Exception as e:
            print("UPDATE USER: ERROR", e)
            raise

    def test_change_password(self):
        user = CustomUser.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )
        self.client.force_authenticate(user=user)
        change_data = {
            "old_password": self.user_data["password"],
            "new_password": "NewPass456!",
            "new_password_confirm": "NewPass456!"
        }
        try:
            response = self.client.patch("/api/auth/change_password", change_data, format="json")
            assert response.status_code == status.HTTP_200_OK
            user.refresh_from_db()
            assert user.check_password("NewPass456!")
            print("CHANGE PASSWORD: OK")
        except Exception as e:
            print("CHANGE PASSWORD: ERROR", e)
            raise

    def test_user_logout(self):
        user = CustomUser.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"]
        )
        login_response = self.client.post("/api/auth/login", {"username": user.username, "password": self.user_data["password"]}, format="json")
        refresh_token = login_response.data["refresh"]
        access_token = login_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        try:
            response = self.client.post("/api/auth/logout", {"refresh": refresh_token}, format="json")
            assert response.status_code == status.HTTP_200_OK
            assert response.data["message"] == "Successfully logged out."
            print("LOGOUT: OK")
        except Exception as e:
            print("LOGOUT: ERROR", e)
            raise