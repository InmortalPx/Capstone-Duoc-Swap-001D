import { Component } from '@angular/core';

interface Solicitud {
  id: number;
  nombre: string;
  correo: string;
  tipoSolicitud: string;
  mensaje: string;
  respuesta?: string;
}

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css'],
})
export class AyudaComponent {
  nombre: string = '';
  correo: string = '';
  mensaje: string = '';
  tipoSolicitud: string = '';
  solicitudes: Solicitud[] = [];

  constructor() {
    // Cargar solicitudes desde el localStorage al inicializar
    const storedSolicitudes = localStorage.getItem('solicitudes');
    if (storedSolicitudes) {
      this.solicitudes = JSON.parse(storedSolicitudes);
    }

    // Mostrar el contenido del localStorage al iniciar
    this.mostrarSolicitudesEnConsola();
  }

  enviarSolicitud() {
    if (!this.nombre || !this.correo || !this.mensaje || !this.tipoSolicitud) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const correoRegex = /^[a-zA-Z0-9._%+-]+@duocuc\.cl$/;
    if (!correoRegex.test(this.correo)) {
      alert('El correo debe ser una dirección válida de Duoc UC (@duocuc.cl).');
      return;
    }

    // Crear una nueva solicitud
    const nuevaSolicitud: Solicitud = {
      id: Date.now(), // Usar timestamp como ID único
      nombre: this.nombre,
      correo: this.correo,
      tipoSolicitud: this.tipoSolicitud,
      mensaje: this.mensaje,
    };

    // Agregar la solicitud a la lista y guardarla en localStorage
    this.solicitudes.push(nuevaSolicitud);
    localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));

    // Mostrar en consola las solicitudes actuales
    this.mostrarSolicitudesEnConsola();

    // Limpiar el formulario
    this.nombre = '';
    this.correo = '';
    this.mensaje = '';
    this.tipoSolicitud = '';
    alert('Su solicitud de ayuda ha sido enviada con éxito.');
  }

  responderSolicitud(id: number, respuesta: string) {
    // Buscar la solicitud por ID y agregar la respuesta
    const solicitud = this.solicitudes.find((s) => s.id === id);
    if (solicitud) {
      solicitud.respuesta = respuesta;
      localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
      alert('Respuesta guardada con éxito.');

      // Mostrar en consola las solicitudes actuales
      this.mostrarSolicitudesEnConsola();
    }
  }

  enviarConEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Evitar salto de línea
      this.enviarSolicitud();
    }
  }

  // Método para mostrar las solicitudes en la consola
  mostrarSolicitudesEnConsola(): void {
    const storedSolicitudes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    console.log('%c[Solicitudes en LocalStorage]', 'color: blue; font-weight: bold;');
    console.table(storedSolicitudes);
  }
}
