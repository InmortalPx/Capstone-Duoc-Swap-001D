import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionMensajeService } from '../../menu/Options/Services/publicacion-mensaje.service';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit {
  mensajes: any[] = [];
  nuevoMensaje = { emisorId: '', receptorId: '', contenido: '' }; // Estructura inicial

  constructor(
    private mensajeService: PublicacionMensajeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener los IDs de los parámetros de ruta para el chat
    this.route.params.subscribe(params => {
      this.nuevoMensaje.emisorId = params['user1Id']; // ID del emisor
      this.nuevoMensaje.receptorId = params['user2Id']; // ID del receptor
      this.getMensajes(); // Carga inicial de los mensajes
    });
  }

  // Obtener mensajes entre el emisor y receptor
  getMensajes() {
    this.mensajeService.getMensajes(this.nuevoMensaje.emisorId, this.nuevoMensaje.receptorId).subscribe({
      next: (response) => {
        this.mensajes = response; // Guarda los mensajes recibidos
        this.markMensajesComoLeidos(); // Marcar mensajes como leídos
      },
      error: (error) => {
        console.error('Error al obtener mensajes', error);
      }
    });
  }

  // Enviar un mensaje
  sendMensaje() {
    if (this.nuevoMensaje.contenido.trim()) {
      this.mensajeService.sendMensaje(
        this.nuevoMensaje.emisorId,
        this.nuevoMensaje.receptorId,
        this.nuevoMensaje.contenido
      ).subscribe({
        next: (response) => {
          console.log('Mensaje enviado:', response);
          this.getMensajes(); // Actualiza la lista de mensajes
          this.nuevoMensaje.contenido = ''; // Limpia el campo de entrada
        },
        error: (error) => {
          console.error('Error al enviar mensaje', error);
        }
      });
    } else {
      alert('¡El mensaje no puede estar vacío!');
    }
  }

  // Opción para marcar mensajes como leídos
  markMensajesComoLeidos() {
    this.mensajes.forEach(mensaje => {
      if (!mensaje.Leido) {
        // Aquí puedes considerar marcar el mensaje como leído según el ID
        this.mensajeService.marcarComoLeido(mensaje.IdMensaje).subscribe();
      }
    });
  }
}