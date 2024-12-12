// services/publicacion-mensaje.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicacionMensajeService {
  private baseUrl = 'http://localhost:3000'; // Cambia esto si es necesario

  constructor(private http: HttpClient) {}

  // Publicaciones
  getPublicaciones(): Observable<any> {
    return this.http.get(`${this.baseUrl}/publicaciones`).pipe(catchError(this.handleError));
  }

  createPublicacion(idEstudiante: string, titulo: string, descripcion: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/publicaciones`, { idEstudiante, titulo, descripcion }).pipe(catchError(this.handleError));
  }

  // Mensajes
  getMensajes(emisorId: string, receptorId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/mensajes/${emisorId}/${receptorId}`).pipe(catchError(this.handleError));
  }

  sendMensaje(emisorId: string, receptorId: string, contenido: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/mensaje`, { emisorId, receptorId, contenido }).pipe(catchError(this.handleError));
  }

  marcarComoLeido(mensajeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/mensaje/leido/${mensajeId}`, {}).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}