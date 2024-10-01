from pathlib import Path
from datetime import datetime
from pyexpat import model
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Account, NuevoProducto, MatchProductoRegalo,MatchProductoCambio, Mensajes
from .forms import RegistrationForm, LoginForm, NuevoProductoForm, ModificarProductoForm, OptarARegaloForm, MensajeForm, CustomPasswordChangeForm, ProfileImageForm
from .models import Categoria, Tags, TipoTrans



###############################
##    Vistas de Usuario      ##
###############################

def login_view(request):
    user_email = None  # Define una variable con un valor predeterminado
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                user_email = user.email  # Obtén el correo electrónico del usuario logeado
                return redirect('Index')  # Redirigir al usuario a la página de inicio después de iniciar sesión
            else:
                form.add_error(None, 'Credenciales inválidas')  # Agregar un mensaje de error al formulario
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form, 'user_email': user_email})

def register_view(request):
    form = RegistrationForm
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(login_view)  # Redirigir al usuario a la página de inicio de sesión después del registro
    else:
        form = RegistrationForm()
    return render(request, 'registro.html', {'form': form})

def exito(request):
    return redirect(editar_perfil)

@login_required
def password_reset_form(request):
    return render(request, 'registration/password_reset_form.html')

@login_required
def editar_perfil(request):
    if request.method=='GET':
        imagen = request.FILES.get('fotoPerfil')
        form_password = CustomPasswordChangeForm(request.user, request.POST)
        user = request.user
        fotoPerfil = Account.objects.values('profile_image').filter(email=user)
        return render(request, 'editar_perfil.html',{'form_password': form_password, 'fotoPerfil':fotoPerfil})
    else:
        if 'cambiar_foto' in request.POST:
            imagen = request.FILES.get('fotoPerfil')
            if imagen:
                account = request.user
                account.profile_image = imagen
                account.save()
                return redirect('exito')
            form_imagen = TuFormularioDeImagen()  # Reemplaza 'TuFormularioDeImagen' con tu formulario real
            return render(request, 'editar_perfil.html', {'form_imagen': form_imagen})

        elif 'cambiar_contrasenia' in request.POST:
            form_password = CustomPasswordChangeForm(request.user, request.POST)
            if form_password.is_valid():
                form_password.save()
                messages.success(request, 'Tu contraseña ha sido cambiada correctamente.')
                return redirect('login')  # Reemplaza 'exito' con la URL o nombre de la vista a la que deseas redirigir después de cambiar la contraseña
            else:
                messages.error(request, 'Por favor, corrige los errores.')
        else:
            form_password = CustomPasswordChangeForm(request.user)
        return render(request, 'editar_perfil.html', {'form_password': form_password})


@login_required
def PerfilUsuario(request):
    return render(request, 'PerfilUsuario.html')

@login_required
def cerrar_sesion(request):
    logout(request)
    return redirect(login_view)

###############################
##           Producto         ##
###############################


@login_required
def ProductoAgregar(request):
    if request.method == 'POST':
        form = NuevoProductoForm(request.POST, request.FILES)
        if form.is_valid():
            # Guardar el formulario con la instancia de usuario
            nuevoProducto = form.save(commit=False)
            nuevoProducto.p_account_email = request.user  # Asignar el usuario actual
            nuevoProducto.p_habilitar = 1  # Habilitar el producto por defecto
            nuevoProducto.save()

            messages.success(request, 'Publicación guardada exitosamente.')
            return redirect('ProductoListar')
        else:
            messages.error(request, 'Hubo un error al guardar el producto. Por favor, verifica los campos.')
    else:
        form = NuevoProductoForm()

    context = {'form': form}
    return render(request, 'ProductoAgregar.html', context)


@login_required
def ProductoModificar(request, id):
    producto = get_object_or_404(NuevoProducto, id=id)
    form = ModificarProductoForm(instance=producto)
    # Asegurar que los querysets estén disponibles en la instancia del formulario
    form.fields['p_categoria'].queryset = Categoria.objects.all()
    form.fields['p_tags'].queryset = Tags.objects.all()
    form.fields['p_tipoTrans'].queryset = TipoTrans.objects.all()

    if request.method == 'POST':
        form = ModificarProductoForm(request.POST, request.FILES, instance=producto)
        if form.is_valid():
            form.save()
            messages.success(request, 'Producto modificado exitosamente.')
            return redirect('ProductoListar')

    return render(request, 'ProductoModificar.html', {'form': form})


@login_required
def ProductoListar(request):
    query = request.GET.get('q')
    
    # Recuperar los productos según el usuario
    if request.user.email == 'root@root.com':
        productos_list = NuevoProducto.objects.all()
    else:
        productos_list = NuevoProducto.objects.filter(p_account_email=request.user)

    # Filtrar por la consulta de búsqueda
    if query:
        productos_list = productos_list.filter(Q(p_nombre__icontains=query) | Q(p_descripcion__icontains=query))

    # Verificar si los productos están habilitados
    productos_activos = productos_list.filter(p_habilitar=1)
    print("Productos activos en ProductoListar:", productos_activos)  # Imprime el `QuerySet` para verificar

    # Configurar la paginación
    paginator = Paginator(productos_activos, 5)
    page = request.GET.get('page')
    productos = paginator.get_page(page)

    context = {
        'productos': productos,
        'search_query': query
    }
    return render(request, 'ProductoListar.html', context)


@login_required
def ProductoEliminar(request, id):
    producto = get_object_or_404(NuevoProducto, id=id)
    if request.user.email == 'root@root.com' or producto.p_account_email == request.user:
        producto.delete()
        messages.success(request, 'Producto eliminado exitosamente.')
    else:
        messages.error(request, 'No tienes permisos para eliminar este producto.')

    return redirect('ProductoReactivar')


@login_required
def ProductoReactivar(request):
    query = request.GET.get('q')
    productos_list = NuevoProducto.objects.filter(p_account_email=request.user)
    if query:
        productos_list = productos_list.filter(Q(p_nombre__icontains=query) | Q(p_descripcion__icontains(query)))

    # Obtener solo los productos inactivos
    productos_inactivos = productos_list.filter(p_habilitar=0)

    paginator = Paginator(productos_inactivos, 5)
    page = request.GET.get('page')
    productos = paginator.get_page(page)

    return render(request, 'ProductoReactivar.html', {'productos': productos, 'search_query': query})


def ProductoDesactivar(request):
    if request.method == 'POST':
        producto_id = request.POST.get('producto_id')
        producto = get_object_or_404(NuevoProducto, id=producto_id)
        producto.p_habilitar = 0
        producto.save()
    return redirect('ProductoListar')


def ProductoActivar(request):
    if request.method == 'POST':
        producto_id = request.POST.get('producto_id')
        producto = get_object_or_404(NuevoProducto, id=producto_id)
        producto.p_habilitar = 1
        producto.save()
    return redirect('ProductoReactivar')



###############################
##            Index          ##
###############################

@login_required
def Index(request):
    query = request.GET.get('q')
    productos = NuevoProducto.objects.all()
    if query:
        # Filtrar los productos por nombre, tipo de transacción y descripción que coincidan con la consulta de búsqueda
        productos = productos.filter(Q(p_nombre__icontains=query) | Q(p_descripcion__icontains=query))
    context = {
        'productos': productos,
        'search_query': query  # Pasar la consulta de búsqueda al contexto
    }
    return render(request, 'Index.html', context)


###############################
##  Optar a cambio/ regalo   ##
###############################

@login_required
def optar_a_regalo(request):
    if request.method == 'POST':
        form = OptarARegaloForm(request.POST)
        if form.is_valid():
            fecha_propuesta = datetime.now()
            producto_id = form.cleaned_data['producto_id']
            usuario_dueño_id = form.cleaned_data['usuario_dueño']
            usuario_solicitante = request.user
            estado_solicitud = 1
            confirmacion_match = 0

            try:
                # Verificar si el producto cumple con los criterios de restricción
                producto = NuevoProducto.objects.get(pk=producto_id, p_tipoTrans_id=2)
            except NuevoProducto.DoesNotExist:
                # Si no se encuentra el producto, mostrar un mensaje de error
                messages.error(request, 'El producto seleccionado no existe.')
                return redirect('Index')

            match_exists = MatchProductoRegalo.objects.filter(
                estado_solicitud=estado_solicitud,
                producto=producto,
                usuario_dueño=usuario_dueño_id,
                usuario_solicitante=usuario_solicitante
            ).exists()

            if match_exists:
                # Si ya existe un MatchProductoRegalo con los mismos valores, mostrar un mensaje de error
                messages.error(request, 'Ya existe un MatchProductoRegalo con los mismos valores.')
                return redirect('Index')

            try:
                # Obtener la instancia de Account (usuario_dueño) usando el ID
                usuario_dueño = Account.objects.get(id=usuario_dueño_id)
            except Account.DoesNotExist:
                # Si no se encuentra el usuario_dueño, mostrar un mensaje de error
                messages.error(request, 'El usuario dueño no existe.')
                return redirect('Index')

            nuevo_match = MatchProductoRegalo(
                fecha_propuesta=fecha_propuesta,
                producto=producto,
                usuario_dueño=usuario_dueño,
                usuario_solicitante=usuario_solicitante,
                estado_solicitud=estado_solicitud,
                confirmacion_match=confirmacion_match
            )
            nuevo_match.save()

            return redirect('Index')

    else:
        return redirect('Index')


@login_required
def optar_a_cambio(request):
    if request.method == 'POST':
        form = OptarARegaloForm(request.POST)
        if form.is_valid():
            fecha_propuesta = datetime.now()
            producto_id = form.cleaned_data['producto_id']
            usuario_dueño_id = form.cleaned_data['usuario_dueño']
            usuario_solicitante = request.user
            estado_solicitud = 1
            confirmacion_match = 0

            try:
                # Verificar si el producto cumple con los criterios de restricción
                producto = NuevoProducto.objects.get(pk=producto_id, p_tipoTrans_id=1)
            except NuevoProducto.DoesNotExist:
                # Si no se encuentra el producto, mostrar un mensaje de error
                messages.error(request, 'El producto seleccionado no existe.')
                return redirect('Index')

            match_exists = MatchProductoCambio.objects.filter(
                estado_solicitud=estado_solicitud,
                producto=producto,
                usuario_dueño=usuario_dueño_id,
                usuario_solicitante=usuario_solicitante
            ).exists()

            if match_exists:
                # Si ya existe un MatchProductoCambio con los mismos valores, mostrar un mensaje de error
                messages.error(request, 'Ya existe un MatchProductoCambio con los mismos valores.')
                return redirect('Index')

            try:
                # Obtener la instancia de Account (usuario_dueño) usando el ID
                usuario_dueño = Account.objects.get(id=usuario_dueño_id)
            except Account.DoesNotExist:
                # Si no se encuentra el usuario_dueño, mostrar un mensaje de error
                messages.error(request, 'El usuario dueño no existe.')
                return redirect('Index')

            nuevo_match = MatchProductoCambio(
                fecha_propuesta=fecha_propuesta,
                producto=producto,
                usuario_dueño=usuario_dueño,
                usuario_solicitante=usuario_solicitante,
                estado_solicitud=estado_solicitud,
                confirmacion_match=confirmacion_match,
                producto_propuesto=None  # Establecer el valor como None para que sea nulo en la base de datos
            )
            nuevo_match.save()

            return redirect('Index')

    else:
        return redirect('Index')


###############################
##            Match          ##
###############################

#@login_required  # Asegura que el usuario esté autenticado para acceder a esta vista
#def Matches(request):
#    query = request.GET.get('q')
#    user_id = request.user.id  # ID del usuario logueado
#    matches_list = MatchProductoRegalo.objects.filter(usuario_dueño_id=user_id)  # Filtrar los matches por el ID del usuario dueño
#    if query:
#        # Filtrar matches adicionales por nombre o descripción del producto que coincida con la consulta de búsqueda
#        matches_list = matches_list.filter(Q(producto__p_nombre__icontains=query) | Q(producto__p_descripcion__icontains=query))
#
#    paginator = Paginator(matches_list, 5)  # Mostrar 5 matches por página
#    page = request.GET.get('page')
#    matches = paginator.get_page(page)
#    context = {
#        'matches': matches,
#        'search_query': query  # Pasar la consulta de búsqueda al contexto
#    }
#    return render(request, 'Matches.html', context)


def MatchesRegalo(request):
    query = request.GET.get('q')
    user_id = request.user.id  # ID del usuario logueado
    matches_list = MatchProductoRegalo.objects.filter(usuario_dueño_id=user_id)  # Filtrar los matches por el ID del usuario dueño
    if query:
        # Filtrar matches adicionales por nombre o descripción del producto que coincida con la consulta de búsqueda
        matches_list = matches_list.filter(Q(producto__p_nombre__icontains=query) | Q(producto__p_descripcion__icontains=query))

    paginator = Paginator(matches_list, 5)  # Mostrar 5 matches por página
    page = request.GET.get('page')
    matches = paginator.get_page(page)
    context = {
        'matches': matches,
        'search_query': query  # Pasar la consulta de búsqueda al contexto
    }
    return render(request, 'MatchesRegalo.html', context)

def MatchesCambio(request):
    query = request.GET.get('q')
    user_id = request.user.id  # ID del usuario logueado
    matches_list = MatchProductoCambio.objects.filter(usuario_dueño_id=user_id)  # Filtrar los matches por el ID del usuario dueño
    if query:
        # Filtrar matches adicionales por nombre o descripción del producto que coincida con la consulta de búsqueda
        matches_list = matches_list.filter(Q(producto__p_nombre__icontains=query) | Q(producto__p_descripcion__icontains=query))

    paginator = Paginator(matches_list, 5)  # Mostrar 5 matches por página
    page = request.GET.get('page')
    matches = paginator.get_page(page)
    context = {
        'matches': matches,
        'search_query': query  # Pasar la consulta de búsqueda al contexto
    }
    return render(request, 'MatchesCambio.html', context)

#@login_required
#def ConfirmarMatch(request):
#    if request.method == 'POST':
#        PostMatch_id = request.POST.get('match_id')
#        if PostMatch_id:
#            try:
#                match = MatchProductoRegalo.objects.get(PostMatch=int(PostMatch_id))
#                # Cambiar el estado de confirmacion_match entre 0 y 1
#                match.confirmacion_match = 1 if match.confirmacion_match == 0 else 0
#                match.save()
#                # Realizar cualquier otra acción que desees después de confirmar el match
#            except MatchProductoRegalo.DoesNotExist:
#                # Manejar el caso cuando no se encuentra un objeto con el ID proporcionado
#                pass
#    return redirect('Matches')

@login_required
def ConfirmarMatchCambio(request):
    if request.method == 'POST':
        PostMatch_id = request.POST.get('match_id')
        if PostMatch_id:
            try:
                match = MatchProductoCambio.objects.get(PostMatch=int(PostMatch_id))
                # Cambiar el estado de confirmacion_match entre 0 y 1
                match.confirmacion_match = 1 if match.confirmacion_match == 0 else 0
                match.save()
                # Realizar cualquier otra acción que desees después de confirmar el match
            except MatchProductoCambio.DoesNotExist:
                # Manejar el caso cuando no se encuentra un objeto con el ID proporcionado
                pass
    return redirect('MatchesCambio')

@login_required
def ConfirmarMatchRegalo(request):
    if request.method == 'POST':
        PostMatch_id = request.POST.get('match_id')
        if PostMatch_id:
            try:
                match = MatchProductoRegalo.objects.get(PostMatch=int(PostMatch_id))
                # Cambiar el estado de confirmacion_match entre 0 y 1
                match.confirmacion_match = 1 if match.confirmacion_match == 0 else 0
                match.save()
                # Realizar cualquier otra acción que desees después de confirmar el match
            except MatchProductoRegalo.DoesNotExist:
                # Manejar el caso cuando no se encuentra un objeto con el ID proporcionado
                pass
    return redirect('MatchesRegalo')


###############################
##  Chat mensajes / Match    ##
###############################

@login_required
def ChatMensajes(request):
    if request.method == 'POST':
        mensaje = MensajeForm(request.POST)
        if mensaje.is_valid():
            new_mensaje = mensaje.save(commit=False)
            new_mensaje.usuarioPost = request.user
            new_mensaje.save()
            return redirect('ChatMensajes')
    else:
        mensaje = MensajeForm()

        # Obtener el nombre del usuario actual
        nombre = Account.objects.get(email=request.user).apellido
        
        # Obtener la cuenta del usuario actual
        usuario_actual = get_object_or_404(Account, email=request.user.email)

        # Obtener los MatchProductoRegalo donde el usuario actual es dueño o solicitante
        matches = MatchProductoRegalo.objects.filter(
            Q(usuario_dueño=usuario_actual) | Q(usuario_solicitante=usuario_actual)
        )

        # Filtrar los mensajes relacionados con los matches del usuario actual
        citas = Mensajes.objects.filter(PostMatch__in=matches)

        return render(request, 'Mensajes.html', {'mensaje': mensaje, 'citas': citas, 'nombre': nombre})
