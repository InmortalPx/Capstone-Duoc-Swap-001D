import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../menu/Options/auth.service';

@Component({
  selector: 'app-login-student',
  templateUrl: './login-student.component.html',
  styleUrls: ['./login-student.component.scss']
})
export class LoginStudentComponent {
  passwordVisible: boolean = false;
  showForgot: boolean = false;
  authData = { username: '', password: '', confirmPassword: '' };
  modoRegistro = false;
  showRegistroStudent = false;

  constructor(public modal: NgbActiveModal, private router: Router, private modalService: NgbModal, private authService: AuthService) {}

  passwordView() {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = document.getElementById('password') as HTMLInputElement | null;
    if (passwordField) {
      passwordField.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  toggleMode() {
    this.modoRegistro = !this.modoRegistro;
    this.authData = { username: '', password: '', confirmPassword: '' };
  }

  onRegister() {
    if (this.authData.password !== this.authData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.authService.register(this.authData.username, this.authData.password).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert(response.message);
        this.toggleMode();
      },
      error: (error) => {
        console.error('Error:', error);
        if (error.status === 409) {
          alert('El nombre de usuario ya está en uso.');
        } else {
          alert('Error del servidor. Intente nuevamente.');
        }
      }
    });
  }

  onStudent() {
    this.authService.loginStudent(this.authData.username, this.authData.password).subscribe({
        next: (response) => {
            console.log('Respuesta del servidor', response);
            alert(response.message);
            localStorage.setItem('token', response.token); // Almacena el token en localStorage
            this.modal.dismiss();
            this.router.navigate(['/menuStudent']);
        },
        error: (error) => {
            console.error('Error:', error);
            alert('Credenciales inválidas.');
        }
    });
}

  openForgotPassword() {
    this.showForgot = true;
  }

  backToLogin() {
    this.showForgot = false;
  }

  toggleRegisterStudent(): void {
    console.log("Activando el registro de estudiantes");
    this.resetViews();
    this.showRegistroStudent = true;
  }

  private resetViews() {
    this.showRegistroStudent = false;
  }
}
