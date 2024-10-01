from django.urls import path
from django.urls import re_path, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
from django.conf import settings
from django.conf.urls.static import static
from django import views
from . import views

urlpatterns = [


########################
##   path de Usuario  ##
########################
    path('', views.login_view, name='login'),
    path('register', views.register_view, name='register'),
    path('PerfilUsuario', views.PerfilUsuario, name='PerfilUsuario'),
    path('editar_perfil', views.editar_perfil, name='editar_perfil'),
    path('cerrar_sesion/',views.cerrar_sesion, name='cerrar_sesion'),
    path('exito', views.exito, name='exito'),

########################
##  path de Producto  ##
########################
    path('Index', views.Index, name='Index'),
    path('ProductoAgregar', views.ProductoAgregar, name="ProductoAgregar"),
    path('ProductoModificar/<int:id>', views.ProductoModificar, name="ProductoModificar"),
    path('ProductoListar/', views.ProductoListar, name="ProductoListar"),
    path('ProductoEliminar/<int:id>/', views.ProductoEliminar, name='ProductoEliminar'),
    path('ProductoDesactivar', views.ProductoDesactivar, name="ProductoDesactivar"),
    path('ProductoReactivar', views.ProductoReactivar, name="ProductoReactivar"),


#####################
##  path de Match  ##
#####################
    path('optar-a-regalo/', views.optar_a_regalo, name='optar_a_regalo'),
    path('optar-a-cambio/', views.optar_a_cambio, name='optar_a_cambio'),
    #path('Matches/', views.Matches, name='Matches'),
    path('MatchesRegalo/', views.MatchesRegalo, name='MatchesRegalo'),
    path('MatchesCambio/', views.MatchesCambio, name='MatchesCambio'),
    #path('ConfirmarMatch/', views.ConfirmarMatch, name='ConfirmarMatch'),
    path('ConfirmarMatchRegalo/', views.ConfirmarMatchRegalo, name='ConfirmarMatchRegalo'),
    path('ConfirmarMatchCambio/', views.ConfirmarMatchCambio, name='ConfirmarMatchCambio'),


#############################
##  path de Mensaje/Foro  ##
#############################
    path('ChatMensajes/', views.ChatMensajes, name='ChatMensajes'),

    #--------------------------------------
####################################
##  path de Recuperar Contraseña  ##
####################################
    #re_path(r'admin/', admin.site.urls),
    #re_path(r'usuario/', include('apps.usuarios.urls', namespace='usuarios' )),
    #re_path(r'^$', login, {'template_name':'index.html'}, name='login'),
    re_path(r'^reset/password_reset$', auth_views.PasswordResetView.as_view(), {
        'template_name': 'registration/password_reset_form',
        'email_template_name': 'registration/password_reset_email'
        }, name='password_reset'),
    re_path(r'^reset/password_reset_done$',PasswordResetDoneView.as_view(), {'template_name':'registration/password_reset_done'}, name='password_reset_done'),
    re_path(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>.+)/$', auth_views.PasswordResetConfirmView.as_view(), {
        'template_name': 'registration/password_reset_confirm.html'
    }, name='password_reset_confirm'),

    re_path(r'^reset/done', auth_views.PasswordResetCompleteView.as_view(), {
        'template_name': 'registration/password_reset_complete.html'
    }, name='password_reset_complete'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
