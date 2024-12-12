import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuario'; 

  constructor(private http: HttpClient) {}

  // Añadir un nuevo usuario
  addUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, usuario);
  }

  // Actualizar un usuario
  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/${id}`, usuario);
  }

  // Eliminar un usuario
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario/${id}`);
  }

  // Buscar usuarios
  searchUsuarios(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { params });
  }
}
