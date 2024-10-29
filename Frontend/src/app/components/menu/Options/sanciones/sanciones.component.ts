import { Component, OnInit } from '@angular/core';
import { SancionesService } from '../Services/sanciones.service';
import { error } from 'jquery';

@Component({
  selector: 'app-sanciones',
  templateUrl: './sanciones.component.html',
  styleUrls: ['./sanciones.component.css']
})
export class SancionesComponent implements OnInit {
  sanciones: any[] = [];
  estudiantes: any[] = [];
  intercambios: any[] = [];
  selectedSancion: any = null;
  isEditing = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';

  constructor(private sancionesService: SancionesService) { }

  ngOnInit(): void {
    this.loadSanciones();
    this.loadEstudiantes();
    this.loadIntercambios();
  }

  loadSanciones(): void {
    this.sancionesService.getSanciones().subscribe({
      next: data => {
        this.sanciones = data;
      },
      error: error => {
        console.error('Error al cargar las sanciones:', error);
      }
    });
  }

  loadEstudiantes(): void{
    this.sancionesService.getEstudiantes().subscribe(data => {
      this.estudiantes = data;
    }, error => {
      console.error('Error al cargar los estudiantes:', error);
    });
  }

  createEstudiante(form: any): void {
    this.sancionesService.createEstudiante(form.value).subscribe(response => {
      console.log('Solicitant registrado:', response);
      this.loadEstudiantes();  // Recargar la lista de estudiantes para la selección
      form.reset();
    }, error => {
      console.error('Error al registrar el Estudiante:', error);
    });
  }
  

  loadIntercambios(): void {
    this.sancionesService.getIntercambios().subscribe(data => {
      this.intercambios = data;
    }, error => {
      console.error('Error al cargar los materiales de intercambio:', error);
    });
  }

  createIntercambio(form: any): void {
    this.sancionesService.createIntercambio(form.value).subscribe(response => {
      console.log('intercambio registrado:', response);
      this.loadIntercambios(); // Recarga la lista de materiales de intercambio para la selección
      form.reset();
    }, error => {
      console.error('Error al registrar el intercambio:', error);
    });
  }
  

  selectSancion(sancion: any): void {
    this.selectedSancion = { ...sancion };
    // Formatea la fecha para que sea compatible con datetime-local
    this.selectedSancion.FechaInicio = this.formatDateTime(this.selectedSancion.FechaInicio);
    this.isEditing = true;
  }

  formatDateTime(dateString: string): string {
    // Crear una nueva fecha a partir del string de fecha ISO
    const date = new Date(dateString);

    // Obtener componentes de la fecha
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    // Formatear en el estilo yyyy-MM-ddThh:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  createSancion(form: any): void {
    if (form.invalid) {
      this.showAlert('Por favor, complete todos los campos correctamente.', 'error');
      return;
    }

    if (form.value.Descripcion < 0) {
      this.showAlert('La descripción no puede ser inválida o incompleta.', 'error');
      return;
    }
  
    this.sancionesService.createSancion(form.value).subscribe({
      next: () => {
        this.loadSanciones();
        form.reset();
        this.showAlert('Sancion agregada exitosamente', 'success');
      },
      error: error => {
        let errorMessage = 'Error al agregar la sancion. ';
        if (error.status === 400) {
          if (error.error && typeof error.error === 'string') {
            errorMessage += error.error;
          } else {
            errorMessage += 'Datos inválidos.';
          }
        } else if (error.status === 500) {
          errorMessage += 'Error interno del servidor.';
        } else {
          errorMessage += 'Error desconocido.';
        }
        this.showAlert(errorMessage, 'error');
      }
    });
  }
  
  updateSancion(): void {
    if (!this.selectedSancion) return;
  
    this.sancionesService.updateSancion(this.selectedSancion.IdSancion, this.selectedSancion).subscribe({
      next: () => {
        this.showAlert('Sancion actualizada exitosamente', 'success');
        this.isEditing = false;
        this.selectedSancion = null;
        this.loadSanciones();
      },
      error: error => {
        let errorMessage = 'Error al actualizar la sancion. ';
        if (error.status === 400) {
          errorMessage += error.error || 'Datos inválidos.';
        } else if (error.status === 404) {
          errorMessage += 'Sancion no encontrada.';
        } else if (error.status === 500) {
          errorMessage += 'Error interno del servidor.';
        } else {
          errorMessage += 'Error desconocido.';
        }
        this.showAlert(errorMessage, 'error');
      }
    });
  }


  deleteSancion(id: number): void {
    this.sancionesService.deleteSancion(id).subscribe({
      next: () => {
        this.loadSanciones();
        this.showAlert('Sancion eliminada exitosamente','success');
      },
      error: error => {
        this.showAlert('Error al eliminar la sancion:' + (error.message), 'error');
      }
    });
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  
}
}


