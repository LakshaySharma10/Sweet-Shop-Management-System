from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

from apps.users.views import UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("users/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("", include(router.urls)),
]
