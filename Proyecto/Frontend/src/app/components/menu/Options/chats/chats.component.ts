import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  chatHistory: any[] = []; // Historial de chats
  selectedChat: any = null; // Chat seleccionado para mostrar detalles
  newMessage: string = ''; // Mensaje nuevo a enviar

  constructor() {}

  ngOnInit(): void {
    this.loadChatHistory();
  }

  // Cargar el historial de chats desde el localStorage
  loadChatHistory(): void {
    const savedChats = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    this.chatHistory = Object.entries(savedChats).map(([id, messages]: any) => ({
      id,
      participant: `Chat ${id}`,
      lastMessage: messages[messages.length - 1]?.text || 'Sin mensajes',
      messages,
    }));
  }

  // Seleccionar un chat para mostrar
  selectChat(chat: any): void {
    this.selectedChat = chat;
  }

  // Cerrar el chat seleccionado
  closeChat(): void {
    this.selectedChat = null;
  }

  // Enviar un mensaje y guardarlo
  sendMessage(): void {
    if (!this.selectedChat || !this.newMessage.trim()) return;

    const message = {
      sender: 'Usuario',
      text: this.newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    this.selectedChat.messages.push(message);
    this.saveChatHistory();
    this.newMessage = '';
  }

  // Guardar el historial de chats en el localStorage
  saveChatHistory(): void {
    const chatsToSave = this.chatHistory.reduce((acc: any, chat: any) => {
      acc[chat.id] = chat.messages;
      return acc;
    }, {});
    localStorage.setItem('chatMessages', JSON.stringify(chatsToSave));
    this.loadChatHistory();
  }
}
