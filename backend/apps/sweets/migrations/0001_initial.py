from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Sweet",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255, unique=True)),
                ("category", models.CharField(max_length=100)),
                ("price", models.DecimalField(max_digits=10, decimal_places=2)),
                ("quantity_in_stock", models.PositiveIntegerField(default=0)),
            ],
            options={
                "db_table": "sweets",
                "ordering": ["name"],
            },
        ),
    ]
