from django.urls import path, include

urlpatterns = [
    path("api/", include("apps.health.urls")),
    path("api/", include("apps.users.urls")),
]
