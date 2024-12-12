import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudianteService {
  private baseUrl = 'http://localhost:3000/estudiantes'; // Asegúrate de usar la URL correcta

  constructor(private http: HttpClient) {}

  // Eliminar un estudiante
  eliminarEstudiante(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Buscar estudiantes
  buscarEstudiantes(filtros: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(filtros).forEach((key) => {
      if (filtros[key]) {
        params = params.set(key, filtros[key]);
      }
    });
    return this.http.get(this.baseUrl, { params });
  }
}
