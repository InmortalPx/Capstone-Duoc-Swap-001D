import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/chats'; // URL base del backend

  private activeMatchesSubject = new BehaviorSubject<any[]>(this.loadFromLocalStorage('activeMatches') || []);
  private matchHistorySubject = new BehaviorSubject<any[]>(this.loadFromLocalStorage('matchHistory') || []);
  private chatMessagesSubject = new BehaviorSubject<{ [key: string]: any[] }>(
    this.loadFromLocalStorage('chatMessages') || {}
  );

  activeMatches$ = this.activeMatchesSubject.asObservable();
  matchHistory$ = this.matchHistorySubject.asObservable();
  chatMessages$ = this.chatMessagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateActiveMatchesWithIds();
  }

  /**
   * Inicia un chat en el backend
   */
  iniciarChat(idEstudiante: number, idMatch: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-chat`, { idEstudiante, idMatch });
  }

  /**
   * Envía un mensaje a través del backend
   */
  enviarMensaje(idEstudiante: number, idMatch: number, mensaje: string) {
    return this.http.post(`${this.apiUrl}/enviar-mensaje`, {
      idEstudiante,
      idMatch,
      mensaje,
    });
  }

  /**
   * Obtener todos los mensajes de un match desde la base de datos.
   */
  obtenerMensajes(idMatch: number) {
    return this.http.get<any[]>(`${this.apiUrl}/mensajes/${idMatch}`);
  }
  /**
   * Sincroniza mensajes con el backend
   */
  sincronizarMensajes(matchId: string): void {
    this.obtenerMensajes(parseInt(matchId, 10)).subscribe(
      (mensajes: any[]) => {
        const currentChatMessages = this.chatMessagesSubject.value;
        currentChatMessages[matchId] = mensajes;

        this.chatMessagesSubject.next(currentChatMessages);
        this.saveToLocalStorage('chatMessages', currentChatMessages);

        console.log(`Mensajes sincronizados para el match ${matchId}:`, mensajes);
      },
      (error) => {
        console.error('Error al sincronizar mensajes del backend:', error);
      }
    );
  }

   // Método para eliminar un match por ID
   deleteMatch(matchId: string): void {
    // Obtener el historial actual desde el BehaviorSubject
    const currentMatchHistory = this.matchHistorySubject.value;
  
    // Filtrar los matches para eliminar el que coincida con el ID proporcionado
    const updatedMatchHistory = currentMatchHistory.filter(match => match.id !== matchId);
  
    // Actualizar el BehaviorSubject y guardar los datos filtrados en el localStorage
    this.matchHistorySubject.next(updatedMatchHistory);
    this.saveToLocalStorage('matchHistory', updatedMatchHistory);
  
    console.log(`Match eliminado del historial: ${matchId}`);
  }
  

  generateUniqueId(match: any): string {
    if (!match.toolName || !match.owner) {
      console.error('[ERROR] Faltan datos para generar un ID único');
      return '';
    }
    return `${match.toolName}-${match.owner}-${new Date().getTime()}`;
  }
  

  /**
   * Actualiza los mensajes de un chat y sincroniza con el backend
   */
  updateChatMessages(matchId: string, messages: any[]): void {
    const currentActiveMatches = this.activeMatchesSubject.value;
    const match = currentActiveMatches.find((m) => m.id === matchId);

    if (match) {
      match.chatMessages = messages;

      // Actualizar matches activos y guardarlos
      this.activeMatchesSubject.next(currentActiveMatches);
      this.saveToLocalStorage('activeMatches', currentActiveMatches);

      console.log(`Mensajes actualizados para el match ${matchId}:`, messages);
    } else {
      console.error('No se encontró el match para actualizar mensajes:', matchId);
    }
  }

  /**
   * Agrega un mensaje a un match específico
   */
  addMessageToMatch(matchId: string, message: any): void {
    const currentChatMessages = this.chatMessagesSubject.value;

    if (!currentChatMessages[matchId]) {
      currentChatMessages[matchId] = [];
    }

    currentChatMessages[matchId].push(message);
    this.chatMessagesSubject.next(currentChatMessages);
    this.saveToLocalStorage('chatMessages', currentChatMessages);

    console.log(`Mensaje agregado para el match ${matchId}:`, message);
  }

  /**
   * Agregar un nuevo match a los activos.
   */
  addActiveMatch(match: any): void {
    const currentActiveMatches = this.activeMatchesSubject.value;

    // Verificar si el match ya existe
    if (currentActiveMatches.find((m) => m.id === match.id)) {
      console.log('El match ya existe en la lista activa:', match);
      return;
    }

    const updatedMatches = [...currentActiveMatches, match];
    this.activeMatchesSubject.next(updatedMatches);
    this.saveToLocalStorage('activeMatches', updatedMatches);

    console.log('Match agregado a activos:', match);
  }

  /**
   * Mover un match activo al historial.
   */
  moveToMatchHistory(match: any): boolean {
    const currentActiveMatches = this.activeMatchesSubject.value;

    const matchIndex = currentActiveMatches.findIndex((m) => m.id === match.id);
    if (matchIndex > -1) {
      const finalizedMatch = { ...currentActiveMatches[matchIndex], status: 'finalizado' };
      const updatedActiveMatches = currentActiveMatches.filter((_, index) => index !== matchIndex);

      // Actualizar matches activos
      this.activeMatchesSubject.next(updatedActiveMatches);
      this.saveToLocalStorage('activeMatches', updatedActiveMatches);

      // Agregar el match al historial
      const currentMatchHistory = this.matchHistorySubject.value;
      const updatedHistory = [...currentMatchHistory, finalizedMatch];

      this.matchHistorySubject.next(updatedHistory);
      this.saveToLocalStorage('matchHistory', updatedHistory);

      console.log('Match movido al historial:', finalizedMatch);
      return true;
    }

    console.error('No se pudo mover el match al historial:', match);
    return false;
  }

  /**
   * Obtener todos los matches activos.
   */
  getActiveMatches(): any[] {
    return this.activeMatchesSubject.value;
  }

  /**
   * Obtener todos los matches en el historial.
   */
  getMatchHistory(): any[] {
    return this.matchHistorySubject.value;
  }

  /**
   * Guardar datos en el localStorage.
   */
  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Cargar datos del localStorage.
   */
  private loadFromLocalStorage(key: string): any {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }

  /**
   * Actualizar los identificadores de los matches activos en el localStorage.
   */
  private updateActiveMatchesWithIds(): void {
    const currentActiveMatches = this.activeMatchesSubject.value.map((match) => ({
      ...match,
      id: match.id || `${match.toolName}-${match.owner}-${Date.now()}`,
    }));

    this.activeMatchesSubject.next(currentActiveMatches);
    this.saveToLocalStorage('activeMatches', currentActiveMatches);

    console.log('Matches activos actualizados con identificadores únicos.');
  }
}
