from django.contrib import admin
from apps.sweets.models import Sweet


@admin.register(Sweet)
class SweetAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "category", "price", "quantity_in_stock")
	search_fields = ("name", "category")
	list_filter = ("category",)
	ordering = ("name",)

