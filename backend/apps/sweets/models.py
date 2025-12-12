from django.db import models


class Sweet(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_in_stock = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "sweets"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.category})"
