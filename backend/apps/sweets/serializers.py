from rest_framework.serializers import ModelSerializer
from apps.sweets.models import Sweet


class SweetSerializer(ModelSerializer):
    class Meta:
        model = Sweet
        fields = (
            "id",
            "name",
            "category",
            "price",
            "quantity_in_stock",
        )
        extra_kwargs = {"id": {"read_only": True}}
