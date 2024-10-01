# Generated by Django 4.2.1 on 2023-06-02 23:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_DUOC_Swap_django', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreCategoria', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='Tags',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreTags', models.CharField(max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='TipoTrans',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreTrans', models.CharField(max_length=20)),
            ],
        ),
    ]
