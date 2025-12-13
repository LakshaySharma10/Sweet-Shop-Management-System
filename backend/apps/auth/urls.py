from django.urls import path
from apps.auth.views import register, LoginView

urlpatterns = [
    path("auth/register/", register, name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
]

