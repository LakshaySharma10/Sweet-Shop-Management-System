from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("apps.health.urls")),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.sweets.urls")),
    path("api/", include("apps.inventory.urls")),
]
