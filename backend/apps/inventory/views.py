from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from apps.sweets.models import Sweet


class PurchaseSweetView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            qty = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response({"detail": "Invalid quantity"}, status=400)
        if qty <= 0:
            return Response({"detail": "Quantity must be positive"}, status=400)

        sweet = get_object_or_404(Sweet, id=id)
        if sweet.quantity_in_stock < qty:
            return Response({"detail": "Insufficient stock"}, status=400)
        sweet.quantity_in_stock -= qty
        sweet.save(update_fields=["quantity_in_stock"])
        return Response({
            "id": sweet.id,
            "name": sweet.name,
            "quantity_in_stock": sweet.quantity_in_stock,
        })


class RestockSweetView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, id):
        try:
            qty = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response({"detail": "Invalid quantity"}, status=400)
        if qty <= 0:
            return Response({"detail": "Quantity must be positive"}, status=400)

        sweet = get_object_or_404(Sweet, id=id)
        sweet.quantity_in_stock += qty
        sweet.save(update_fields=["quantity_in_stock"])
        return Response({
            "id": sweet.id,
            "name": sweet.name,
            "quantity_in_stock": sweet.quantity_in_stock,
        })
