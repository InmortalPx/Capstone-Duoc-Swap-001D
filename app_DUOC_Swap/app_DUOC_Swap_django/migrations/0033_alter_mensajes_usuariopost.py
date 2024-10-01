# Generated by Django 5.1.1 on 2024-09-09 19:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_DUOC_Swap_django', '0032_alter_matchproductocambio_producto_propuesto_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mensajes',
            name='usuarioPost',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuario_que_postea', to=settings.AUTH_USER_MODEL),
        ),
    ]
