import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit {
  chatHistory: any[] = []; // Historial de chats
  selectedChat: any = null; // Chat seleccionado para mostrar detalles

  constructor() {}

  ngOnInit(): void {
    this.loadChatHistoryFromLocalStorage();
  }

  // Cargar el historial de chats desde el localStorage
  loadChatHistoryFromLocalStorage(): void {
    const savedChats = JSON.parse(localStorage.getItem('chatMessages') || '{}');

    // Transformar los chats en un array legible para mostrar
    this.chatHistory = Object.keys(savedChats).map(matchId => ({
      participant: `Match ID: ${matchId}`, // Puedes cambiar esta descripción
      lastMessage: savedChats[matchId]?.[savedChats[matchId].length - 1]?.text || 'Sin mensajes',
      date: new Date().toLocaleDateString(), // Fecha actual (puedes agregar una real si está disponible)
      messages: savedChats[matchId] || []
    }));

    console.log('[DEBUG] Historial de chats cargado:', this.chatHistory);
  }

  // Seleccionar un chat para mostrar sus detalles
  selectChat(chat: any): void {
    this.selectedChat = chat;
  }

  // Cerrar el chat seleccionado
  closeChat(): void {
    this.selectedChat = null;
  }
}
