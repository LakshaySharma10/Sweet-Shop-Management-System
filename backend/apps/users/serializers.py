from rest_framework.serializers import ModelSerializer
from apps.users.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "password",
        )
        extra_kwargs = {"password": {"write_only": True}, "id": {"read_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
