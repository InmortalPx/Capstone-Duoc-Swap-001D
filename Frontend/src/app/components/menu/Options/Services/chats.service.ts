import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://localhost:3000/chats'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los chats
  getChats(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un chat por ID
  getChat(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo chat (usando el procedimiento almacenado CrearChat)
  createChat(chat: { IdEstudiante: number; IdMatch: number }): Observable<any> {
    return this.http.post(this.apiUrl, chat).pipe(
      catchError(this.handleError)
    );
  }

  // Enviar un mensaje en un chat (usando el procedimiento almacenado EnviarMensaje)
  enviarMensaje(mensaje: { IdEstudiante: number; IdMatch: number; Mensaje: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviarMensaje`, mensaje).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un chat
  updateChat(id: number, chat: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, chat).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un chat
  deleteChat(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError(error.error || 'Error desconocido');
  }
}
