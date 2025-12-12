from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.sweets.views import SweetViewSet

router = DefaultRouter()
router.register("sweets", SweetViewSet, basename="sweets")

urlpatterns = [
    path("", include(router.urls)),
]
