# Fase inicial del proyecto Duoc Swap (Minimo Funcional)

- Paso 1: tener instalado python.           
- Paso 2: configurar la base de datos. descargar mariadb, cambiar contraseña, revisar el puerto el nombre de la base de datos todo que coincida con la configuración en Setting:
```
  DATABASES ={
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'lcncode', #Nombre de la base de datos cambiar si gustan
        'USER': 'root', #Nombre usuario cambiar si gustan
        'PASSWORD': 'Aquí nueva contraseña',
        'HOST': 'localhost',
        'PORT': '3307', #Aqui escoger nuevo puerto o dejar el 3307
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}                                                       
```                                             
- Paso 3: abrir el archivo en el visual, Ejecutar comandos: pip install django,  pip install mysqlclient, py -m pip install Pillow, luego crear entorno virtual: C:\Users\c.munoz8\Desktop\ProyectoDuocSwap>py -m venv env 

- Paso 4: env\scripts\activate # para lograr activar el entorno virtual, luego ir a la carpeta llamada app_duoc_swap para correr el comando: py manage.py makemigrations #para revisar si tiene cambios la base de datos, py manage.py migrate # para migrar los datos desde django a base de datos

- Paso 5: (env) C:\Users\c.munoz8\Desktop\ProyectoDuocSwap> teniendo el entorno virtual corriendo, después para ir a la carpeta app_duoc_swap recuerden digitar en la terminal cd app_duoc_swap y se vera la ruta donde deben iniciar los comandos para correr su proyecto ejemplo: py manage.py runserver
