import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:3000/estudiante'; 
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}


  // Añadir un nuevo estudiante
  addEsttudiante(estudiante: { NombreCompleto: string, IdEstudiante: string, Correo: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, estudiante);
  }

  // Actualizar un estudiante
  updateEstudiante(id: number, estudiante: { NombreCompleto: string, IdEstudiante: string, Correo: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, estudiante);
  }

  // Eliminar un Estudiante
  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Buscar Estudiantes
  searchEstudiantes(params: { busqueda?: string, IdEstudiante?: string, correo?: string, NombreCompleto?: string }): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }
}
