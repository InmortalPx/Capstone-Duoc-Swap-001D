import re
from django import forms
from typing import Any, Dict
from django.utils.safestring import mark_safe
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth.models import *
from . import models
from django.forms import ModelForm
from .models import Account, TipoTrans, Categoria, Tags, NuevoProducto, Mensajes


###############################
##   Formularios de Usuario  ##
###############################

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(label='Ingresa tu Correo DuocUC', max_length=60, widget=forms.TextInput(attrs={'style': 'width: 98%;', 'placeholder': 'Ingrese tu Correo DUOC UC'}))
    nombre = forms.CharField(label='Ingresa tu Nombre', max_length=50, widget=forms.TextInput(attrs={'style': 'width: 98%;', 'placeholder': 'Ingrese su Nombre.'}))
    apellido = forms.CharField(label='Ingresa tu Apellido', max_length=50, widget=forms.TextInput(attrs={'style': 'width: 98%;', 'placeholder': 'Ingrese su Apellido.'}))
    rut_usuario = forms.CharField(label='Ingresa tu RUT', max_length=20, widget=forms.TextInput(attrs={'style': 'width: 98%;', 'placeholder': 'Ingrese su RUT.'}))
    password1 = forms.CharField(label='Ingresa tu Contraseña', max_length=100, widget=forms.PasswordInput(attrs={'style': 'width: 98%;', 'placeholder': 'Debe tener números, letras y símbolos (8 caracteres mínimo)'}))
    password2 = forms.CharField(label='Vuelve a ingresar tu Contraseña', max_length=100, widget=forms.PasswordInput(attrs={'style': 'width: 98%;', 'placeholder': 'Debe ser idéntica a la anterior'}))

    class Meta:
        model = Account
        fields = ['email', 'nombre', 'apellido', 'rut_usuario', 'password1', 'password2']
        help_texts = {k: '' for k in fields}

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email.endswith('@duocuc.cl'):
            raise forms.ValidationError('Debes utilizar un correo electrónico válido de DuocUC.')
        if Account.objects.filter(email=email).exists():
            raise forms.ValidationError('Este correo electrónico ya está registrado.')
        return email

    def clean_rut_usuario(self):
        rut = self.cleaned_data.get('rut_usuario')
        rut_pattern = r'^\d{2}\.\d{3}\.\d{3}-\d$'

        if not re.match(rut_pattern, rut):
            raise forms.ValidationError('El formato del RUT ser con puntos y guión (ej: xx.xxx.xxx-x)')
        return rut

class LoginForm(forms.Form):
    email = forms.EmailField(
        label='Correo electrónico',
        widget=forms.TextInput(attrs={'style': 'width: 98%;','placeholder': 'Ingresa tu Correo Duoc UC'})
    )
    password = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'style': 'width: 98%;','placeholder': 'Ingresa tu Contraseña'})
    )
    def restriction_email(self):
        email = self.cleaned_data['email']
        if not email.endswith('@duocuc.cl'):
            raise forms.ValidationError('El correo electrónico debe ser de dominio @duocuc.cl')
        return email
        self.fields['new_password1'].widget.attrs['placeholder'] = 'Nueva contraseña'
        self.fields['new_password2'].widget.attrs['placeholder'] = 'Confirmar nueva contraseña'

class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ['profile_image']

class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Personalizar los campos del formulario si es necesario
        self.fields['old_password'].widget.attrs['placeholder'] = 'Contraseña actual'


###############################
##  Formularios de Producto  ##
###############################

class NuevoProductoForm(forms.ModelForm):
    class Meta:
        model = NuevoProducto
        fields = ['p_nombre', 'p_img', 'p_descripcion', 'p_tipoTrans', 'p_categoria', 'p_tags']
        labels = {
            'p_nombre': 'Ingresa título de publicación',
            'p_img': 'Agrega una imagen',
            'p_descripcion': 'Ingresa la descripción (máximo 300 Caracteres)',
            'p_tipoTrans': 'Selecciona el tipo de transacción a realizar',
            'p_categoria': 'Selecciona una categoría para tu Producto',
            'p_tags': 'Selecciona los tags asociados a tu publicación',
        }
        widgets = {
            'p_nombre': forms.TextInput(attrs={'style': 'width: 98%;'}),
            'p_img': forms.FileInput(attrs={'class': 'form-control-file;'}),
            'p_descripcion': forms.Textarea(attrs={'class': 'wider-textarea', 'rows': 5, 'style': 'width: 98%;'}),
            'p_tipoTrans': forms.Select(attrs={'class': 'form-check'}),
            'p_categoria': forms.Select(attrs={'class': 'form-check'}),
            'p_tags': forms.Select(attrs={'class': 'form-check'}),
        }

class ModificarProductoForm(forms.ModelForm):
    class Meta:
        model = NuevoProducto
        fields = ['p_nombre', 'p_img', 'p_tipoTrans', 'p_descripcion', 'p_categoria', 'p_tags']
        labels = {
            'p_nombre': 'Modifica el título de tu publicación',
            'p_img': 'Cambia la imagen precargada',
            'p_tipoTrans': 'Selecciona o cambia el tipo de transacción a realizar:',
            'p_descripcion': 'Ingresa o cambia la descripción (máximo 300 caracteres)',
            'p_categoria': 'Selecciona o cambia la categoría para tu producto:',
            'p_tags': 'Selecciona los tags asociados a tu publicación:',
        }
        widgets = {
            'p_nombre': forms.TextInput(attrs={'class': 'form-control', 'style': 'width: 98S%;'}),
            'p_img': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
            'p_tipoTrans': forms.Select(attrs={'class': 'form-control-check', 'placeholder': 'Selecciona o cambia el tipo de transacción a realizar:'}),
            'p_descripcion': forms.Textarea(attrs={'class': 'form-control-wider-textarea', 'rows': 5, 'style': 'width: 98%;'}),
            'p_categoria': forms.Select(attrs={'class': 'form-control-check'}),
            'p_tags': forms.Select(attrs={'class': 'form-control-check'})
        }
    def get_image_preview(self):
        if self.instance and self.instance.p_img:
            return mark_safe(f'<img src="{self.instance.p_img.url}" width="200" height="200" />')
        return ''

#############################################
##   Formularios de Optar a Cambio/Regalo  ##
#############################################

class OptarARegaloForm(forms.Form):
    producto_id = forms.IntegerField(widget=forms.HiddenInput())
    usuario_dueño = forms.IntegerField(widget=forms.HiddenInput())

class OptarACambioForm(forms.Form):
    producto_id = forms.IntegerField(widget=forms.HiddenInput())
    usuario_dueño = forms.IntegerField(widget=forms.HiddenInput())

#####################################
##   Formularios de Mensajes Chat  ##
#####################################

class MensajeForm(forms.ModelForm):
    mensajePost = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = Mensajes
        fields = ['mensajePost']