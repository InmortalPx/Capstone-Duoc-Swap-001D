# Generated by Django 4.2.1 on 2023-06-14 06:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app_DUOC_Swap_django', '0030_alter_matchproductoregalo_producto_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchproductocambio',
            name='producto_propuesto',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='matches_propuesto', to='app_DUOC_Swap_django.nuevoproducto'),
        ),
    ]
