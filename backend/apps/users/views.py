from rest_framework.viewsets import ModelViewSet
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.users.models import User
from apps.users.serializers import UserSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    @action(
        detail=False, methods=["get", "patch"], permission_classes=[IsAuthenticated]
    )
    def me(self, request, *args, **kwargs):
        instance = request.user
        if request.method == "PATCH":
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

            if "password" in request.data:
                instance.set_password(request.data["password"])
                instance.save()
                serializer.validated_data.pop("password", None)

            serializer.save()
        else:
            serializer = self.get_serializer(instance)

        return Response(serializer.data)
