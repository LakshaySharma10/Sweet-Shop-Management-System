from django.contrib.auth.models import AbstractUser

from django.db.models import CharField


class User(AbstractUser):
    middle_name = CharField(max_length=255, null=True, blank=True)
