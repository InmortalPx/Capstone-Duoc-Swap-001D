# Generated by Django 4.2.1 on 2023-06-03 00:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_DUOC_Swap_django', '0006_nuevo_producto_p_tipotrans'),
    ]

    operations = [
        migrations.RenameField(
            model_name='nuevo_producto',
            old_name='descProducto',
            new_name='p_descripcion',
        ),
        migrations.RenameField(
            model_name='nuevo_producto',
            old_name='imgProducto',
            new_name='p_img',
        ),
        migrations.RenameField(
            model_name='nuevo_producto',
            old_name='nombrePublicacion',
            new_name='p_nombre',
        ),
    ]
