# Generated by Django 4.2.1 on 2023-06-07 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_DUOC_Swap_django', '0011_nuevoproducto_p_account_email'),
    ]

    operations = [
        migrations.CreateModel(
            name='TablaPrueba',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prueba', models.CharField(max_length=20)),
            ],
        ),
        migrations.AlterField(
            model_name='nuevoproducto',
            name='p_img',
            field=models.ImageField(null=True, upload_to=''),
        ),
    ]
