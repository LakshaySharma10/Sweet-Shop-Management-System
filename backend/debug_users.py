from django.contrib.auth import get_user_model
User = get_user_model()
users = list(User.objects.values('username', 'email', 'is_active'))
print(f"DEBUG_USERS_FOUND: {users}")
