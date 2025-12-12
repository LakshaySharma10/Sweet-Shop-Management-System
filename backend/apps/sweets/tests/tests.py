import time
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from apps.sweets.models import Sweet

User = get_user_model()


class SweetsTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.start_time = time.time()
        print("\n" + "="*60)
        print("Running Sweets Tests....")
        print("="*60)

    @classmethod
    def tearDownClass(cls):
        elapsed_time = time.time() - cls.start_time
        print("\n" + "="*60)
        print("All sweets tests completed successfully!")
        print(f"Total execution time: {elapsed_time:.2f} seconds")
        print("="*60 + "\n")
        super().tearDownClass()

    def setUp(self) -> None:
        self.user = User.objects.create_user(username="tester", password="tester")
        self.admin = User.objects.create_superuser(username="admin", password="admin")

        # Authenticate regular user by default
        self.client.force_authenticate(user=self.user)

        # Seed some sweets
        Sweet.objects.create(name="Ladoo", category="Traditional", price=120.50, quantity_in_stock=50)
        Sweet.objects.create(name="Barfi", category="Traditional", price=200.00, quantity_in_stock=20)
        Sweet.objects.create(name="Chocolate", category="Modern", price=80.00, quantity_in_stock=100)

    def test_create_sweet(self):
        print("\nSWEETS TEST 1: Creating a new sweet")
        url = reverse("sweets-list")
        data = {
            "name": "Gulab Jamun",
            "category": "Traditional",
            "price": 150.00,
            "quantity_in_stock": 30,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["name"], "Gulab Jamun")
        print("\nSWEETS TEST 1: PASSED ✓")

    def test_list_sweets(self):
        print("\nSWEETS TEST 2: Listing sweets")
        url = reverse("sweets-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 3)
        names = [s["name"] for s in response.data]
        self.assertIn("Ladoo", names)
        self.assertIn("Barfi", names)
        print("\nSWEETS TEST 2: PASSED ✓")

    def test_search_sweets(self):
        print("\nSWEETS TEST 3: Searching sweets by name and price range")
        url = reverse("sweets-search")
        response = self.client.get(url + "?name=lad&min_price=100&max_price=180")
        self.assertEqual(response.status_code, 200)
        # Expect only Ladoo (120.5) to match name and price range
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Ladoo")
        print("\nSWEETS TEST 3: PASSED ✓")

    def test_update_sweet(self):
        print("\nSWEETS TEST 4: Updating a sweet")
        sweet = Sweet.objects.get(name="Barfi")
        url = reverse("sweets-detail", args=[sweet.id])
        response = self.client.put(url, {
            "name": "Barfi",
            "category": "Traditional",
            "price": 220.00,
            "quantity_in_stock": 25,
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["price"], "220.00")
        self.assertEqual(response.data["quantity_in_stock"], 25)
        print("\nSWEETS TEST 4: PASSED ✓")

    def test_delete_sweet_admin_only(self):
        print("\nSWEETS TEST 5: Deleting a sweet (admin only)")
        sweet = Sweet.objects.get(name="Chocolate")
        url = reverse("sweets-detail", args=[sweet.id])

        # Regular user should be forbidden
        response = self.client.delete(url)
        self.assertIn(response.status_code, [401, 403])

        # Admin can delete
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Sweet.objects.filter(id=sweet.id).exists())
        print("\nSWEETS TEST 5: PASSED ✓")
