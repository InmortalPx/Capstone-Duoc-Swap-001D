import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../menu/Options/auth.service';
import { PerfilComponent } from '../perfil/perfil.component';

@Component({
  selector: 'app-login-student',
  templateUrl: './login-student.component.html',
  styleUrls: ['./login-student.component.scss']
})
export class LoginStudentComponent {
  passwordVisible: boolean = false;
  showForgot: boolean = false;
  authData = { username: '', password: '', confirmPassword: '' };
  modoRegistro: boolean = false;

  constructor(
    public modal: NgbActiveModal,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  // Mostrar/ocultar contraseña
  passwordView() {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = document.getElementById('password') as HTMLInputElement | null;
    if (passwordField) {
      passwordField.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  // Alternar entre el modo de registro e inicio de sesión
  toggleMode() {
    this.modoRegistro = !this.modoRegistro;
    this.resetStudentData();
  }

  // Restablecer los datos del formulario
  resetStudentData() {
    this.authData = { username: '', password: '', confirmPassword: '' };
  }

  // Registrar estudiante
  // Registrar estudiante
onRegister() {
  if (!this.authData.username || !this.authData.password || !this.authData.confirmPassword) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (this.authData.password !== this.authData.confirmPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  // Intentar registrar al estudiante en el backend
  this.authService.registerStudent(this.authData.username, this.authData.password).subscribe({
    next: (response) => {
      console.log('Respuesta del servidor:', response);
      alert('Registro exitoso en el servidor. Ahora puedes iniciar sesión.');
      this.toggleMode(); // Cambiar al modo de inicio de sesión
    },
    error: (error) => {
      console.error('Error del servidor:', error);

      if (error.status === 0 || error.status === 500 || error.status === 404) {
        // Modo offline: Guardar datos en localStorage como respaldo
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some((user: any) => user.username === this.authData.username);

        if (userExists) {
          alert('El nombre de usuario ya está registrado localmente.');
        } else {
          users.push({
            username: this.authData.username,
            password: this.authData.password,
          });
          localStorage.setItem('users', JSON.stringify(users));
          alert('Registro exitoso en modo offline. Ahora puedes iniciar sesión.');
          this.toggleMode(); // Cambiar al modo de inicio de sesión
        }
      } else if (error.status === 409) {
        alert('El nombre de usuario ya está en uso en el servidor.');
      } else {
        alert('Error desconocido. Por favor, intenta nuevamente.');
      }
    },
  });
}


  // Iniciar sesión de estudiante
  onLoginStudent() {
    if (!this.authData.username || !this.authData.password) {
      alert('Por favor, ingresa tu nombre de usuario y contraseña.');
      return;
    }
  
    // Intentar autenticación con el backend
    this.authService.loginStudent(this.authData.username, this.authData.password).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Inicio de sesión exitoso.');
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', this.authData.username);
        this.modal.dismiss(); // Cerrar el modal de login
        this.router.navigate(['/menuStudent']); // Navegar al menú principal
      },
      error: () => {
        console.warn('El backend no está disponible o las credenciales no son válidas.');
  
        // Verificar credenciales en localStorage
        const usuariosLocales = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioEncontrado = usuariosLocales.find((usuario: any) =>
          usuario.NombreUsuario === this.authData.username &&
          usuario.Contrasena === this.authData.password
        );
  
        if (usuarioEncontrado) {
          alert('Inicio de sesión exitoso.');
          localStorage.setItem('username', this.authData.username);
          this.modal.dismiss(); // Cerrar el modal de login
          this.router.navigate(['/menuStudent']); // Navegar al menú principal
        } else {
          alert('Credenciales inválidas o usuario no registrado.');
        }
      }
    });
  }
  
  

  // Abrir el modal de perfil
  openProfileModal() {
    const modalRef = this.modalService.open(PerfilComponent);
    modalRef.componentInstance.username = localStorage.getItem('username');
  }
}
