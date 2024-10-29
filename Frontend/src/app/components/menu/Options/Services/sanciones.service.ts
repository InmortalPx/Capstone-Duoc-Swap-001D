import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SancionesService {
  private apiUrl = 'http://localhost:3000/sanciones';  // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) { }

  getSanciones(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
    catchError(this.handleError)
    );
  }

  getEstudiantes(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:3000/estudiante');
  }

  createEstudiante(estudiante: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/estudiante`, estudiante);
  }

  getIntercambios(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:3000/loan')
  }

  createIntercambio(intercambio: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/loans`, intercambio);
  }

  getSancion(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSancion(sancion: any): Observable<any> {
    return this.http.post(this.apiUrl, sancion).pipe(
      catchError(this.handleError)
    );
  }

  updateSancion(id: number, sancion: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, sancion).pipe(
      catchError(this.handleError)
    );
  }

  deleteSancion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError(error.error || 'Error desconocido');
  }
}