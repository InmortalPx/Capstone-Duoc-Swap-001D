import { AppModule } from '../../../../app.module';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro-estudiante',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.componen.css']
})
export class RegistroEstudianteComponent {
  estudiante = {
    IdEstudiante: '',
    NombreCompleto:'',
    Correo:'',

  };
  showConfirmationModal = true;
  confirmationCode = '';
  errorMessage = '';
  NombreCompleto = '' ;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  onSubmit() {
    if (this.estudiante.NombreCompleto && this.estudiante.IdEstudiante && this.estudiante.Correo) {
      this.http.post('http://localhost:3000/estudiante', this.estudiante).subscribe(
        (response: any) => {
          this.snackBar.open('Estudiante registrado exitosamente', 'Cerrar', {

          });
        },
        (error) => {
          this.snackBar.open('Error al registrar el estudiante:', 'Cerrar',{
        });
    }
  );
    } else {
      this.errorMessage = 'Todos los campos son obligatorios';
    }
  }

  

  openConfirmationModal() {
    this.showConfirmationModal = true;
  }

  closeModal(event: MouseEvent) {
    this.showConfirmationModal = false;
  }

  onSubmitCode() {
    if (this.confirmationCode === '123456') { // Aquí deberías validar el código real
      console.log('Código confirmado');
      this.closeModal(new MouseEvent('click'));
    } else {
      this.errorMessage = 'Código incorrecto';
    }
  }

  resendCode() {
    console.log('Código reenviado');
  }
  
}