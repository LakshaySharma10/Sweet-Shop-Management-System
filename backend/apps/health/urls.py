from django.urls import path, include
from rest_framework import routers

from apps.health.views import HealthCheckView

router = routers.DefaultRouter()
router.register(
    "health",
    HealthCheckView,
    basename="health-check-viewset",
)

urlpatterns = [
    path("", include(router.urls)),
]
