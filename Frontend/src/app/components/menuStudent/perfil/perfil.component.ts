import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteService } from '../../menu/Options/Services/estudiante.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  estudiante: any = {};
  profileImageUrl: string = '';
  isEditing: boolean = false;

  constructor(private estudianteService: EstudianteService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadEstudianteProfile();
  }

  loadEstudianteProfile(): void {
    const idEstudiante = localStorage.getItem('idEstudiante');
    if (idEstudiante) {
      this.estudianteService.searchEstudiantes({ IdEstudiante: idEstudiante }).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.estudiante = data[0];
            this.profileImageUrl = 'assets/default-profile.png';
          }
        },
        (error) => {
          console.error('Error al cargar el perfil del estudiante:', error);
        }
      );
    }
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.estudianteService.updateEstudiante(this.estudiante.IdEstudiante, this.estudiante).subscribe(
      (response) => {
        this.snackBar.open('Perfil actualizado con éxito', 'Cerrar', { duration: 3000 });
        this.isEditing = false;
      },
      (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
      }
    );
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}