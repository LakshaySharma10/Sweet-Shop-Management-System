from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.sweets.models import Sweet
from apps.sweets.serializers import SweetSerializer


class SweetViewSet(ModelViewSet):
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "destroy":
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request, *args, **kwargs):
        name = request.query_params.get("name")
        category = request.query_params.get("category")
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")

        filters = Q()
        if name:
            filters &= Q(name__icontains=name)
        if category:
            filters &= Q(category__iexact=category)
        if min_price:
            try:
                filters &= Q(price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                filters &= Q(price__lte=float(max_price))
            except ValueError:
                pass

        queryset = self.get_queryset().filter(filters)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
