import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Añadir un nuevo material
  addTool(tool: any, portada: File | null): Observable<any> {
    const formData = new FormData();
    Object.keys(tool).forEach(key => {
      if (tool[key] !== null && tool[key] !== undefined) {
        formData.append(key, tool[key]);
        console.log(`Añadiendo ${key}: ${tool[key]}`);
      }
    });
    if (portada) {
      formData.append('portada', portada, portada.name);
      console.log(`Añadiendo portada: ${portada.name}`);
    } else {
      console.log('No se ha añadido portada');
    }
    console.log('FormData completo:', formData);
    return this.http.post(`${this.apiUrl}/addTool`, formData);
  }
  // Obtener todos los materials
  getAllTools(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tools`);
  }

  // Buscar materials
  searchTools(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/searchTools`, { params });
  }

  // Obtener un material por serie
  getToolBySERIE(serie: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tool/${serie}`);
  }

  // Actualizar un material
  updateTool(serie: string, tool: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateTool/${serie}`, tool);
  }

  // Eliminar un material
  deleteTool(serie: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteTool/${serie}`);
  }

  // Obtener marcas y editoriales
  getAmarcasAndPublishers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/materials/marcas-editoriales`);
  }
}