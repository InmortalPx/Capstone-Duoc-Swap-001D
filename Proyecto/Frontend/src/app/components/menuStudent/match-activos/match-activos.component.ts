import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../menu/Options/Services/match.service';

@Component({
  selector: 'app-match-activos',
  templateUrl: './match-activos.component.html',
  styleUrls: ['./match-activos.component.css']
})
export class MatchActivosComponent implements OnInit {

  activeMatches: Match[] = [];
  newMessage: string = '';
  conversationStep: number = 0; // Paso de la conversación

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatchesFromLocalStorage();
    this.matchService.activeMatches$.subscribe(matches => {
      this.activeMatches = matches;
      this.saveMatchesToLocalStorage();
    });
  }

  // Carga los matches y mensajes de localStorage
  loadMatchesFromLocalStorage(): void {
    const savedMatches = JSON.parse(localStorage.getItem('activeMatches') || '[]');
    const savedChats = JSON.parse(localStorage.getItem('chatMessages') || '{}');

    this.activeMatches = savedMatches.map((match: any) => ({
      ...match,
      chatMessages: savedChats[match.id] || [] // Cargar mensajes de localStorage o inicializar vacío
    }));
  }

  // Guarda los matches y mensajes en localStorage
  saveMatchesToLocalStorage(): void {
    // Guardar matches activos
    localStorage.setItem('activeMatches', JSON.stringify(this.activeMatches));

    // Guardar mensajes por separado en un objeto
    const chatMessages = this.activeMatches.reduce((acc: { [key: string]: any[] }, match) => {
      if (match.id) {
        acc[match.id] = match.chatMessages || [];
      } else {
        console.warn('Match sin ID encontrado:', match);
      }
      return acc;
    }, {});

    // Guardar los mensajes en localStorage
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    console.log('Matches y mensajes guardados en localStorage');
  }

  // Abre o cierra el chat del match
  toggleChat(match: Match): void {
    match.showChat = !match.showChat;

    if (match.showChat) {
      match.chatMessages = this.loadChatMessagesFromLocalStorage(match.id);
      console.log(`[DEBUG] Mensajes cargados para el chat del match ${match.id}:`, match.chatMessages);
    }

    this.saveMatchesToLocalStorage(); // Guardar cambios en localStorage
    console.log(`[DEBUG] Chat ${match.showChat ? 'abierto' : 'cerrado'} para el match:`, match);
  }

  // Carga los mensajes de chat desde localStorage para un match específico
  loadChatMessagesFromLocalStorage(matchId: string): any[] {
    if (!matchId) {
      console.error('[ERROR] No se puede cargar mensajes: el ID del match está vacío.');
      return [];
    }

    const savedChats = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    const messages = savedChats[matchId];

    if (!messages) {
      console.warn(`[WARNING] No se encontraron mensajes para el ID ${matchId}.`);
      return []; // Si no hay mensajes, retornamos un array vacío
    } else {
      console.log(`[DEBUG] Mensajes cargados desde localStorage para el ID ${matchId}:`, messages);
      return messages;
    }
  }

  // Cierra el chat del match
  closeChat(match: Match): void {
    match.showChat = false;
  }

  // Envía un mensaje
  sendMessage(match: Match): void {
    if (!this.newMessage.trim()) {
      console.warn('[WARNING] No se puede enviar un mensaje vacío.');
      return;
    }

    const userMessage = { sender: 'Estudiante', text: this.newMessage.trim() };
    match.chatMessages.push(userMessage);

    // Simulación de respuesta progresiva del propietario
    this.simulateOwnerResponse(match);

    // Guardar cambios en localStorage
    this.saveMatchesToLocalStorage();
    this.newMessage = ''; // Limpiar el campo de entrada
  }

  // Simula la respuesta del propietario (conversación automatizada)
  simulateOwnerResponse(match: Match): void {
    const ownerName = match.owner || 'Propietario';
    let response = '';

    // Lógica de respuesta simulada
    switch (this.conversationStep) {
      case 0:
        response = `¡Hola! Qué bueno que estés interesado. ¿Tienes alguna duda o vamos directo a coordinar el lugar?`;
        this.conversationStep++;
        break;
      case 1:
        response = `El producto está en excelentes condiciones. ¿Te parece mañana a las 4:30 PM en la biblioteca del campus?`;
        this.conversationStep++;
        break;
      case 2:
        response = `¡Listo! Entonces nos vemos mañana. Lleva una identificación, porfa. ¡Gracias por confirmar!`;
        this.conversationStep = 0; // Reiniciar para nuevas conversaciones
        break;
      default:
        response = `Gracias por tu mensaje. Estoy atento a cualquier consulta.`;
        break;
    }

    const ownerMessage = { sender: `Propietario (${ownerName})`, text: response };
    setTimeout(() => {
      match.chatMessages.push(ownerMessage);
      this.saveMatchesToLocalStorage();
      console.log(`[DEBUG] Respuesta simulada del propietario:`, ownerMessage);
    }, 1500); // Retraso simulado de 1.5 segundos
  }

  // Utiliza trackBy para mejorar el rendimiento de la lista de matches
  trackByMatchId(index: number, match: Match): string {
    return match.id; // Devuelve el ID único del match
  }

  // Confirma el match y lo mueve al historial
  confirmMatch(match: Match): void {
    console.log('Confirmando el match:', match);

    const result = this.matchService.moveToMatchHistory(match);

    if (result) {
      // Eliminar el match confirmado de la lista activa
      this.activeMatches = this.activeMatches.filter(m => m.id !== match.id);
      this.saveMatchesToLocalStorage();

      // Mensaje de éxito
      alert('Match finalizado, guardado en mis matches');
      console.log('Match confirmado y movido al historial:', match);
    } else {
      console.error('No se pudo mover el match al historial:', match);
    }
  }

}

interface Match {
  id: string;
  toolName: string;
  owner: string;
  chatMessages: any[];
  status: string;
  showChat?: boolean;
}
