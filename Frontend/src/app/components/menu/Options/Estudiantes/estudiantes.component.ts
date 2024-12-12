import { Component } from '@angular/core';
import { EstudianteService } from '../Services/estudiante.service';

@Component({
  selector: 'app-registro-estudiante',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css'],
})
export class RegistroEstudianteComponent {
  estudiantes: any[] = [];
  filtros = {
    busqueda: '',
    NombreUsuario: '',
    Correo: '',
    NombreCompleto: '',
  };

  constructor(private estudianteService: EstudianteService) {}

  // Método para eliminar un estudiante
  eliminarEstudiante(id: string): void {
    this.estudianteService.eliminarEstudiante(id).subscribe({
      next: (response) => {
        alert('Estudiante eliminado exitosamente');
        this.buscarEstudiantes(); // Actualiza la lista después de eliminar
      },
      error: (error) => {
        console.error('Error al eliminar estudiante:', error);
        alert('Hubo un error al eliminar el estudiante');
      },
    });
  }

  // Método para buscar estudiantes
  buscarEstudiantes(): void {
    this.estudianteService.buscarEstudiantes(this.filtros).subscribe({
      next: (response) => {
        this.estudiantes = response;
      },
      error: (error) => {
        console.error('Error al buscar estudiantes:', error);
        alert('Hubo un error al buscar estudiantes');
      },
    });
  }
}
