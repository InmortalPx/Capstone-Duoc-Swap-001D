import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../menu/Options/Services/ToolService';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  profilePhoto: string | null = null; // Foto de perfil temporal
  defaultPhoto = 'assets/default-profile.png'; // Foto de perfil predeterminada

  constructor(private toolService: ToolService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    if (!this.username) {
      console.error('No se encontró el nombre de usuario en localStorage.');
      return;
    }

    // Cargar la foto de perfil almacenada en localStorage
    const storedPhoto = localStorage.getItem('profilePhoto');
    this.profilePhoto = storedPhoto ? storedPhoto : this.defaultPhoto;

    this.fetchUserDetails(this.username);
  }

  /**
   * Obtiene los detalles del usuario desde el servidor utilizando ToolService.
   * @param username El nombre de usuario.
   */
  fetchUserDetails(username: string): void {
    this.toolService.getStudentByUsername(username).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const student = data[0];
          this.email = student.Correo;
          this.phone = student.Telefono;
        } else {
          console.error('No se encontró el estudiante en la base de datos.');
        }
      },
      error: (err) => {
        console.error('Error al obtener los detalles del usuario:', err);
      }
    });
  }

  /**
   * Maneja la selección de una foto de perfil y la guarda temporalmente en localStorage.
   * @param event Evento del input file.
   */
  onPhotoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhoto = e.target.result; // Imagen en base64
        console.log('Foto cargada:', this.profilePhoto);
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  /**
   * Guarda la foto de perfil en localStorage.
   */
  savePhoto(): void {
    if (this.profilePhoto) {
      localStorage.setItem('profilePhoto', this.profilePhoto);
      console.log('Foto de perfil guardada en localStorage.');
    }
  }

  /**
   * Actualiza el número de teléfono y guarda temporalmente en localStorage.
   * @param newPhone Nuevo número de teléfono.
   */
  editPhone(newPhone: string): void {
    this.phone = newPhone;
    console.log('Teléfono actualizado:', this.phone);
    localStorage.setItem('phone', newPhone);

    if (this.username) {
      this.toolService.updateStudentPhone(this.username, newPhone).subscribe({
        next: () => {
          console.log('Teléfono actualizado en la base de datos.');
        },
        error: (err) => {
          console.error('Error al actualizar el teléfono en la base de datos:', err);
        }
      });
    }
  }
}
