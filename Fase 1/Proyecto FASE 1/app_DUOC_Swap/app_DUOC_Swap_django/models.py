from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class MyAccountManager(BaseUserManager):
    def create_user(self, email, nombre, apellido, rut_usuario, password=None, **extra_fields):
        if not email:
            raise ValueError('El email debe ser proporcionado')
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, apellido=apellido, rut_usuario=rut_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre, apellido, rut_usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_admin') is not True:
            raise ValueError('El superusuario debe tener is_admin=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')
        return self.create_user(email, nombre, apellido, rut_usuario, password, **extra_fields)


class Account(AbstractBaseUser):
    email           = models.EmailField(verbose_name="email", max_length=60, unique=True)
    nombre          = models.CharField(verbose_name='nombre', max_length=50, unique=False)
    apellido        = models.CharField(verbose_name='apellido', max_length=50, unique=False)
    rut_usuario     = models.CharField(verbose_name='rut_usuario', max_length=20, unique=True)
    is_admin        = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    is_staff        = models.BooleanField(default=False)
    is_superuser    = models.BooleanField(default=False)
    profile_image   = models.ImageField(max_length=255, null=True, blank=True)
    objects = MyAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'rut_usuario']

    def __str__(self):
        return self.email
    def has_perm(self, perm, obj=None):
        return self.is_admin
    def has_module_perms(self, app_label):
        return True


class Categoria(models.Model):
    nombreCategoria = models.CharField(max_length=60)

    def __str__(self):
        return self.nombreCategoria

class TipoTrans(models.Model):
    nombreTrans = models.CharField(max_length=20)

    def __str__(self):
        return self.nombreTrans

class Tags(models.Model):
    nombreTags = models.CharField(max_length=90)
    categoriaTags = models.ForeignKey(Categoria, on_delete=models.PROTECT,  null=True)

    def __str__(self):
        return self.nombreTags

class NuevoProducto(models.Model):
    p_nombre = models.CharField(max_length=60)
    p_img= models.ImageField(null=True)
    p_descripcion = models.CharField(max_length=3000, null=True)
    p_tipoTrans = models.ForeignKey(TipoTrans, on_delete=models.PROTECT, null=True)
    p_categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT,  null=True)
    p_tags = models.ForeignKey(Tags, on_delete=models.PROTECT,  null=True)
    p_account_email = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, null=True)
    p_habilitar = models.IntegerField(choices=[(0, 'deshabilitado'), (1, 'habilitado')], default=1)

    def __str__(self):
        return self.p_nombre

class TagsPublicacion(models.Model):
    idPublicacion = models.ForeignKey(NuevoProducto, on_delete=models.PROTECT)
    tagPublicacion = models.ForeignKey(Tags, on_delete=models.CASCADE)

    def __str__(self):
        return f"Publicación: {self.idPublicacion.p_nombre} - Tag: {self.tagPublicacion.nombreTags}"


class TablaPrueba(models.Model):
    prueba = models.CharField(max_length=20)
    def __str__(self):
        return self.prueba


class MatchProductoRegalo(models.Model):
    PostMatch = models.AutoField(primary_key=True)
    fecha_propuesta = models.DateTimeField(auto_now_add=True)
    producto = models.ForeignKey(NuevoProducto, on_delete=models.CASCADE, related_name='matches_producto')
    usuario_dueño = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='matches_dueno')
    usuario_solicitante = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='matches_solicitante')
    estado_solicitud = models.IntegerField(choices=[(0, 'Inactivo'), (1, 'Activo')], default=1)
    confirmacion_match = models.IntegerField(choices=[(0, 'No confirmado'), (1, 'Confirmado')], default=0)

    def __str__(self):
        return f'ID: {self.PostMatch} - Producto: {self.producto.p_nombre}'

class MatchProductoCambio(models.Model):
    PostMatch = models.AutoField(primary_key=True)
    fecha_propuesta = models.DateTimeField(auto_now_add=True)
    producto = models.ForeignKey(NuevoProducto, on_delete=models.CASCADE)
    producto_propuesto = models.ForeignKey(NuevoProducto, on_delete=models.CASCADE, related_name='matches_propuesto', null=True, blank=True)
    usuario_dueño = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='matches_cambio_dueno')
    usuario_solicitante = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='matches_cambio_solicitante')
    estado_solicitud = models.IntegerField(choices=[(0, 'Inactivo'), (1, 'Activo')], default=1)
    confirmacion_match = models.IntegerField(choices=[(0, 'No confirmado'), (1, 'Confirmado')], default=0)

    def __str__(self):
        return f'ID: {self.PostMatch} - Producto: {self.producto.p_nombre}'

class Mensajes(models.Model):
    usuarioPost = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='usuario_que_postea')
    mensajePost = models.TextField()
    PostMatch = models.ForeignKey(MatchProductoRegalo, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.usuarioPost}'