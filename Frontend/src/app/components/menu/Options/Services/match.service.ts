import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:3000'; // URL base del backend

  constructor(private http: HttpClient) {}

  crearMatch(user1Id: string, user2Id: string, productSerie: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/match`, { user1Id, user2Id, productSerie });
  }

  obtenerHistorial(userId: string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches/${userId}`);
  }
}