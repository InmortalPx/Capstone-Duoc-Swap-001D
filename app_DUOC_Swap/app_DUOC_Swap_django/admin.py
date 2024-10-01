from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

# Register your models here.

class AccountAdmin(UserAdmin):
    list_display = ('email', 'nombre', 'apellido', 'rut_usuario', 'is_admin', 'is_staff', 'is_superuser')
    search_fields = ('email', 'nombre', 'apellido', 'rut_usuario')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

    ordering = ('email',)  # Ordenar por el campo 'email'

admin.site.register(Account, AccountAdmin)

admin.site.register(Mensajes)
