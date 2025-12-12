import time
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from apps.sweets.models import Sweet

User = get_user_model()


class InventoryTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.start_time = time.time()
        print("\n" + "="*60)
        print("Running Inventory Tests....")
        print("="*60)

    @classmethod
    def tearDownClass(cls):
        elapsed_time = time.time() - cls.start_time
        print("\n" + "="*60)
        print("All inventory tests completed successfully!")
        print(f"Total execution time: {elapsed_time:.2f} seconds")
        print("="*60 + "\n")
        super().tearDownClass()

    def setUp(self) -> None:
        self.user = User.objects.create_user(username="tester", password="tester")
        self.admin = User.objects.create_superuser(username="admin", password="admin")
        self.client.force_authenticate(user=self.user)

        self.sweet = Sweet.objects.create(
            name="Jalebi", category="Traditional", price=90.00, quantity_in_stock=25
        )

    def test_purchase_success(self):
        print("\nINVENTORY TEST 1: Purchase reduces stock")
        url = reverse("inventory-purchase", args=[self.sweet.id])
        response = self.client.post(url, {"quantity": 5}, format="json")
        self.assertEqual(response.status_code, 200)
        self.sweet.refresh_from_db()
        self.assertEqual(self.sweet.quantity_in_stock, 20)
        print("\nINVENTORY TEST 1: PASSED ✓")

    def test_purchase_invalid_quantity(self):
        print("\nINVENTORY TEST 2: Invalid quantity rejected")
        url = reverse("inventory-purchase", args=[self.sweet.id])
        response = self.client.post(url, {"quantity": -3}, format="json")
        self.assertEqual(response.status_code, 400)
        self.sweet.refresh_from_db()
        self.assertEqual(self.sweet.quantity_in_stock, 25)
        print("\nINVENTORY TEST 2: PASSED ✓")

    def test_purchase_insufficient_stock(self):
        print("\nINVENTORY TEST 3: Insufficient stock prevented")
        url = reverse("inventory-purchase", args=[self.sweet.id])
        response = self.client.post(url, {"quantity": 100}, format="json")
        self.assertEqual(response.status_code, 400)
        self.sweet.refresh_from_db()
        self.assertEqual(self.sweet.quantity_in_stock, 25)
        print("\nINVENTORY TEST 3: PASSED ✓")

    def test_restock_admin_only(self):
        print("\nINVENTORY TEST 4: Restock requires admin")
        url = reverse("inventory-restock", args=[self.sweet.id])
        # Regular user forbidden
        response = self.client.post(url, {"quantity": 10}, format="json")
        self.assertIn(response.status_code, [401, 403])
        # Admin allowed
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(url, {"quantity": 10}, format="json")
        self.assertEqual(response.status_code, 200)
        self.sweet.refresh_from_db()
        self.assertEqual(self.sweet.quantity_in_stock, 35)
        print("\nINVENTORY TEST 4: PASSED ✓")
