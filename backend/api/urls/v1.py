from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("apps.health.urls")),
    path("api/", include("apps.auth.urls")),  # Auth endpoints: /api/auth/register, /api/auth/login
    path("api/", include("apps.users.urls")),  # User management endpoints
    path("api/", include("apps.sweets.urls")),
    path("api/", include("apps.inventory.urls")),
]
