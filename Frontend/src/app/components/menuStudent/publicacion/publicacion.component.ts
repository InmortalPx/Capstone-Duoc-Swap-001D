// publicacion.component.ts
import { Component, OnInit } from '@angular/core';
import { PublicacionMensajeService } from '../../menu/Options/Services/publicacion-mensaje.service';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit {
  publicaciones: any[] = [];
  nuevaPublicacion = { idEstudiante: '', titulo: '', descripcion: '' };

  constructor(private publicacionService: PublicacionMensajeService) {}

  ngOnInit() {
    this.getPublicaciones();
  }

  getPublicaciones() {
    this.publicacionService.getPublicaciones().subscribe({
      next: (response) => {
        this.publicaciones = response;
      },
      error: (error) => {
        console.error('Error al obtener publicaciones', error);
      }
    });
  }

  createPublicacion() {
    this.publicacionService.createPublicacion(
      this.nuevaPublicacion.idEstudiante,
      this.nuevaPublicacion.titulo,
      this.nuevaPublicacion.descripcion
    ).subscribe({
      next: (response) => {
        console.log('Publicación creada:', response);
        this.getPublicaciones(); // Actualiza las publicaciones
      },
      error: (error) => {
        console.error('Error al crear publicación', error);
      }
    });
  }
}
