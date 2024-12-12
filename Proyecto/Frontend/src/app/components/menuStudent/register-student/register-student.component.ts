import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent {
  @Output() registroCompletado = new EventEmitter<void>();
  NombreCompleto: string = '';
  Correo: string = '';
  Telefono: string = '';
  NombreUsuario: string = '';
  Contrasena: string = '';
  acceptedTerms: boolean = false;
  emailError: boolean = false;
  canAcceptTerms: boolean = false;
  modoRegistro = false;
  authData = { username: '', password: '', confirmPassword: '' };


  constructor(private router: Router, private snackBar: MatSnackBar, private http: HttpClient) {
    // Verificar si hay un token en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const storedToken = localStorage.getItem('confirmationToken');

    if (token && storedToken) {
      if (token === storedToken) {
        // Guardar el registro solo si el token coincide
        this.confirmRegistration();
        localStorage.removeItem('confirmationToken'); // Eliminar el token tras su uso
      } else {
        this.snackBar.open('El enlace de confirmación es inválido o ha expirado.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    }
  }

  showTerms(event: Event) {
    event.preventDefault();
    document.getElementById('termsAndConditions')!.style.display = 'block';
    document.getElementById('termsOverlay')!.style.display = 'block';
  }
  
  hideTerms() {
    document.getElementById('termsAndConditions')!.style.display = 'none';
    document.getElementById('termsOverlay')!.style.display = 'none';
    this.canAcceptTerms = true; // Habilitar el checkbox después de cerrar los términos
  }
  

  sendEmail() {
    // Generar un token único (simula la confirmación del correo)
    const token = btoa(`${this.Correo}-${Date.now()}`); // Codifica en Base64
    const confirmationLink = `http://localhost:4200/register-student?token=${token}`;

    // Almacenar el token temporalmente (simula una base de datos)
    localStorage.setItem('confirmationToken', token);

    // Enviar correo con el enlace de confirmación
    const templateParams = {
      to_name: this.NombreCompleto,
      to_email: this.Correo,
      message: `Gracias por registrarte en DuocSwap. Por favor, confirma tu registro haciendo clic en el siguiente enlace: ${confirmationLink}`
    };

    return emailjs
      .send('service_8ryukra', 'template_a80q638', templateParams, '0n-Q-wdMvAUgwh3nG')
      .then(() => {
        this.snackBar.open(
          'Correo de confirmación enviado. Por favor, verifica tu correo para completar el registro.',
          'Cerrar',
          {
            duration: 5000,
            verticalPosition: 'top'
          }
        );
        this.resetFields(); // Limpiar los campos del formulario
      })
      .catch((error) => {
        console.error('Error enviando correo:', error);
        this.snackBar.open('Error al enviar el correo de confirmación.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      });
  }

  saveEstudiante() {
    if (!this.acceptedTerms) {
      this.snackBar.open('Debes aceptar los términos y condiciones.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (this.validateInput()) {
      const estudianteData = {
        NombreCompleto: this.NombreCompleto,
        Correo: this.Correo,
        Telefono: this.Telefono,
        NombreUsuario: this.NombreUsuario,
        Contrasena: this.Contrasena,
      };

      try {
        // Guardar los datos en el localStorage
        const usuariosLocales = JSON.parse(localStorage.getItem('usuarios') || '[]');
        usuariosLocales.push(estudianteData);
        localStorage.setItem('usuarios', JSON.stringify(usuariosLocales));

        // Confirmar por consola y alerta de éxito
        console.log('Los datos del estudiante se guardaron correctamente en localStorage: ', estudianteData);
        this.snackBar.open('Registro guardado correctamente en localStorage.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });

        // Redirigir automáticamente al loginStudent
        this.router.navigate(['/loginStudent']);

        // Limpiar los campos
        this.resetFields();
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        this.snackBar.open('Error al guardar los datos. Inténtalo nuevamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    }
  }
  
  removerUsuarioLocal(nombreUsuario: string) {
    let usuariosLocales = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuariosLocales = usuariosLocales.filter((usuario: any) => usuario.NombreUsuario !== nombreUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosLocales));
    console.log(`Usuario ${nombreUsuario} eliminado del almacenamiento local.`);
  }
  

  
  sincronizarDatosConBackend() {
    const usuariosLocales = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuariosLocales.forEach((usuario: any) => {
      this.http.post('http://localhost:3000/estudiantes', usuario)
        .subscribe({
          next: () => {
            console.log(`Usuario ${usuario.NombreUsuario} sincronizado con el backend`);
            this.removerUsuarioLocal(usuario.NombreUsuario); // Asegúrate de implementar esta función
          },
          error: (err) => {
            console.error(`Error sincronizando usuario ${usuario.NombreUsuario}:`, err);
          }
        });
    });
  }
  
  
  
  guardarEnLocalStorage(estudianteData: any) {
    const usuariosLocales = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioExiste = usuariosLocales.some(
      (usuario: any) => usuario.NombreUsuario === estudianteData.NombreUsuario
    );
  
    if (!usuarioExiste) {
      usuariosLocales.push(estudianteData);
      localStorage.setItem('usuarios', JSON.stringify(usuariosLocales));
    } else {
      this.snackBar.open('El usuario ya está registrado localmente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
    }
  }
  

  confirmRegistration() {
    const estudianteData = {
      NombreCompleto: this.NombreCompleto,
      Correo: this.Correo,
      Telefono: this.Telefono,
      NombreUsuario: this.NombreUsuario,
      Contrasena: this.Contrasena
    };

    this.http.post('http://localhost:3000/estudiantes', estudianteData).subscribe({
      next: () => {
        this.snackBar.open('Correo verificado y registro exitoso. Ahora puedes iniciar sesión.', 'Cerrar', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.router.navigate(['/loginStudent']); // Redirigir al login tras el éxito
      },
      error: (error) => {
        console.error('Error guardando el registro:', error);
        this.snackBar.open('Error al completar el registro. Intenta nuevamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  resetFields() {
    this.NombreCompleto = '';
    this.Telefono = '';
    this.Contrasena = '';
    this.Correo = '';
    this.NombreUsuario = '';
    this.acceptedTerms = false;
    this.emailError = false;
  }

  toggleMode() {
    this.modoRegistro = !this.modoRegistro;
    this.resetStudentData();
  }
  resetStudentData() {
    this.authData = { username: '', password: '', confirmPassword: '' };
  }

  validateInput(): boolean {
    if (!this.validateNombreCompleto()) {
      this.snackBar.open('Error: Nombre Completo es obligatorio.', 'Cerrar', { duration: 3000 });
      return false;
    }

    if (!this.validateCorreo()) {
      this.snackBar.open('Error: Correo @duocuc.cl es obligatorio.', 'Cerrar', { duration: 3000 });
      return false;
    }

    if (!this.validateTelefono()) {
      this.snackBar.open('Error: Teléfono debe ser válido.', 'Cerrar', { duration: 3000 });
      return false;
    }

    if (!this.validateNombreUsuario()) {
      this.snackBar.open('Error: Nombre de estudiante es obligatorio.', 'Cerrar', { duration: 3000 });
      return false;
    }

    if (!this.validateContrasena()) {
      this.snackBar.open('Error: Contraseña es obligatoria.', 'Cerrar', { duration: 3000 });
      return false;
    }

    return true;
  }

  validateNombreCompleto(): boolean {
    return this.NombreCompleto.trim().length > 0 && this.NombreCompleto.length <= 50;
  }

  validateCorreo(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@duocuc\.cl$/;
    return emailRegex.test(this.Correo) && this.Correo.trim().length <= 100;
  }

  validateTelefono(): boolean {
    const phoneRegex = /^\d{7,15}$/;
    return phoneRegex.test(this.Telefono);
  }

  validateNombreUsuario(): boolean {
    return this.NombreUsuario.trim().length > 0 && this.NombreUsuario.length <= 50;
  }

  validateContrasena(): boolean {
    return this.Contrasena.trim().length > 0 && this.Contrasena.length <= 255;
  }

  confirmCancel() {
    this.resetFields();
    this.snackBar.open('El Registro se ha cancelado', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  validateEmail() {
    this.emailError = !this.validateCorreo();
  }
  
}

@NgModule({
  declarations: [RegisterStudentComponent],
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule, HttpClientModule],
  exports: [RegisterStudentComponent]
})
export class RegisterStudentModule {}
