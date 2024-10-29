import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // URL base de tu backend

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, password });
  }

  

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

 

  registerStudent(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-student`, { username, password });
  }


  loginStudent(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/loginStudent`, { username, password });
  }

  // Verifica si el token existe en localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Retorna true si el token existe, de lo contrario false
  }


  getStudentProfile(): Observable<any> {
    return this.http.get('http://localhost:3000/studentProfile');
  }
  
  logout(): void {
    localStorage.removeItem('token');
    // Puedes agregar aquí cualquier otra lógica necesaria para el cierre de sesión
  }

}
