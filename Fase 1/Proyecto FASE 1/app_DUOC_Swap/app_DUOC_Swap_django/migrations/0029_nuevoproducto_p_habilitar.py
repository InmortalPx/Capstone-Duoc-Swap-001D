# Generated by Django 4.2.1 on 2023-06-14 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_DUOC_Swap_django', '0028_alter_account_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='nuevoproducto',
            name='p_habilitar',
            field=models.IntegerField(choices=[(0, 'deshabilitado'), (1, 'habilitado')], default=1),
        ),
    ]
