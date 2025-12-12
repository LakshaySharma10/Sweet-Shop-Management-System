from django.urls import path
from apps.inventory.views import PurchaseSweetView, RestockSweetView

urlpatterns = [
    path("sweets/<int:id>/purchase", PurchaseSweetView.as_view(), name="inventory-purchase"),
    path("sweets/<int:id>/restock", RestockSweetView.as_view(), name="inventory-restock"),
]
