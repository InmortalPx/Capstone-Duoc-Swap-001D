import { ChangeDetectorRef, Component } from '@angular/core';
import { MatchService } from '../Services/match.service';
import { toDate, format } from 'date-fns-tz';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToolService } from '../Services/ToolService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EditToolsComponent } from '../EditTools/EditTools.component';


@Component({
  selector: 'app-search-tools',
  templateUrl: './search-tools.component.html',
  styleUrls: ['./search-tools.component.css']
})
export class SearchToolsComponent {
  selectedCategory: string = '';
  selectedType: string = '';
  selectedTool: any = null;
  showPreview: boolean = false;
  loading: boolean = false;
  showChat: boolean = false;
  chatMessages: any[] = [];
  newMessage: string = '';
  conversationStep: number = 0;
  isTyping: boolean = false;
  
  categories: string[] = [
    'Escuela de Construcción',
    'Escuela de Turismo y Hospitalidad',
    'Escuela de Ingeniería y Recursos Naturales',
    'Escuela de Administración y Negocios',
    'Escuela de Informática y Telecomunicaciones',
    'Escuela de Salud',
    'Escuela de Diseño',
    'Escuela de Comunicación',
    'Escuela de Gastronomía'
  ];

  types: string[] = ['Intercambio', 'Regalo']; // Tipos de productos

  allTools: any[] = [
    {
      name: 'Calculadora Científica',
      category: 'Escuela de Informática y Telecomunicaciones',
      brand: 'Casio',
      type: 'Intercambio',
      description: 'Calculadora científica de alta precisión ideal para estudiantes de ingeniería y matemáticas.',
      image: 'https://th.bing.com/th/id/OIP.cgG5cYMSrMsRAiTy5auM-AAAAA?rs=1&pid=ImgDetMain',
      duenio: 'Felipe Mejias'
    },
    {
      name: 'Cuaderno de notas',
      category: 'Escuela de Comunicación',
      brand: 'Moleskine',
      type: 'Regalo',
      description: 'Cuaderno de notas de alta calidad, ideal para escritura y bocetos.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_755488-MCO47746810375_102021-O.webp',
      duenio: 'Rosario Andrade' 
    },
    {
      name: 'Laptop Asus Tuf Gaming',
      category: 'Escuela de Informática y Telecomunicaciones',
      brand: 'Asus',
      type: 'Intercambio',
      description: 'Laptop potente, ideal para programadores y diseñadores gráficos.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_ZibqI0TETyR8abLzSOLsaOymbAPhuBK8SQ&s',
      duenio: 'Tomas Muñoz'
    },
    {
      name: 'Mochila para portátil',
      category: 'Escuela de Diseño',
      brand: 'Swissgear',
      type: 'Regalo',
      description: 'Mochila de alta calidad, perfecta para transportar tu laptop y otros objetos personales.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6XBrgRFYrig6NMTniZkG-oEt-u3DfDd9m4Q&s',
      duenio: 'Andres Moran'
    },
    {
      name: 'Taza personalizada',
      category: 'Escuela de Comunicación',
      brand: 'Starbucks',
      type: 'Regalo',
      description: 'Taza de cerámica con diseño exclusivo y personalizado.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_990593-MLM70139655523_062023-O.webp',
      duenio: 'Lucia Ugarte'
    },
    {
      name: 'Silla ergonómica',
      category: 'Escuela de Administración y Negocios',
      brand: 'Herman Miller',
      type: 'Intercambio',
      description: 'Silla ergonómica de oficina, ideal para largas horas de trabajo.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_913777-MCO41852707133_052020-O.webp',
      duenio: 'Andrea Moraga'
    },
    {
      name: 'Auriculares Bluetooth',
      category: 'Escuela de Ingeniería y Recursos Naturales',
      brand: 'Sony',
      type: 'Regalo',
      description: 'Auriculares inalámbricos con excelente calidad de sonido.',
      image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSfP1TcRBG7XZ8BAk7x-eEm2jlNzA-F_W86VUMCboS-1siWkyedOAhcJSm7Wr0RaqqZoXBbd9wK0Qw_PzbpV70Wh4m9OQtkwc5UG_gR-f-oQJjXZPt-pwcSl3zhWf1lcBEnokCmAJ4&usqp=CAc',
      duenio: 'Nancy Avila'
    },
    {
      name: 'Pluma estilográfica',
      category: 'Escuela de Comunicación',
      brand: 'Parker',
      type: 'Regalo',
      description: 'Pluma estilográfica de lujo, perfecta para escribir con estilo.',
      image: 'https://i.etsystatic.com/9672239/r/il/4c5cd5/688273970/il_570xN.688273970_es4p.jpg',
      duenio: 'Francisco Casas'
    },
    {
      name: 'Kit de herramientas básicas',
      category: 'Escuela de Construcción',
      brand: 'Black+Decker',
      type: 'Intercambio',
      description: 'Kit completo de herramientas para trabajos de construcción y reparaciones.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_953577-MLC48306116438_112021-O.webp',
      duenio: 'Carlos Nuñez'
    },
    {
      name: 'Cámara DSLR Canon',
      category: 'Escuela de Diseño',
      brand: 'Canon',
      type: 'Intercambio',
      description: 'Cámara profesional para fotografía, ideal para estudiantes de diseño gráfico.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNj0j4RNEBJtqVnaFKNEVJl3hJL6E6Zcw8CA&s',
      duenio: 'Javier Castro'
    },
    {
      name: 'Gafas de sol Ray-Ban',
      category: 'Escuela de Turismo y Hospitalidad',
      brand: 'Ray-Ban',
      type: 'Regalo',
      description: 'Gafas de sol clásicas de Ray-Ban con protección UV.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_2X_871458-MLC73394167222_122023-T.webp',
      duenio: 'Rodrigo Perez'
    },
    {
      name: 'Silla gamer',
      category: 'Escuela de Ingeniería y Recursos Naturales',
      brand: 'DXRacer',
      type: 'Intercambio',
      description: 'Silla ergonómica diseñada especialmente para largas sesiones de juego.',
      image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTBuv9VK632cSdrZo_K0bYP4GVrM3tqHRl8TeGv4Z6twWsQjA4Fe9dUN-NrXZ1wcyIW2dTG1VBeiB_-Bp3b7QpUTIfdnh3rDhmw4M5_OkfD16kC0iNWWbeQ2aOWmwVuHA&usqp=CAc',
      duenio: 'Martin Gonzalez'
    },
    {
      name: 'Micrófono USB',
      category: 'Escuela de Comunicación',
      brand: 'Blue Yeti',
      type: 'Intercambio',
      description: 'Micrófono USB de alta calidad para grabación y streaming.',
      image: 'https://cdnx.jumpseller.com/killstore/image/47388331/resize/610/610?1718121120',
      duenio: 'Gonzalo Palma'
    },
    {
      name: 'Lentes de realidad virtual',
      category: 'Escuela de Informática y Telecomunicaciones',
      brand: 'Oculus',
      type: 'Intercambio',
      description: 'Lentes de realidad virtual de alta gama, ideales para juegos y desarrollo.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF3Y6Pv2zYVbF1iPSyBTiBsDxuSn9RTEL_Lw&s',
      duenio: 'Esteban Zapata'
    },
    {
      name: 'Pizarra blanca',
      category: 'Escuela de Administración y Negocios',
      brand: '3M',
      type: 'Regalo',
      description: 'Pizarra blanca de tamaño grande para presentaciones y reuniones.',
      image: 'https://http2.mlstatic.com/D_NQ_NP_959288-MLC76961764016_062024-O.webp',
      duenio: 'Ester Rivera'
    },
  ];

  filteredTools: any[] = this.allTools;
  countdown: number = 5; // Contador inicial de 5 segundos
  matchConfirmed: boolean = false;
  showContactingAlert: boolean = false;
  searchQuery: string = '';
  selectedAmarca: string = '';
  selectedPublisher: string = '';
  tools: any[] = [];
  showLoanForm: boolean = false;
 
  showEmailWarning: boolean = false;

  idEstudiante: number = 0;
  serie: string = '';
  fechaIntercambio: string = '';
  idUsuario: number = 0;


  constructor(private matchService: MatchService, 
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private toolService: ToolService,
    private sanitizer: DomSanitizer
  ) {}

  previewTool(tool: any) {
    this.selectedTool = {
      ...tool, // Mantener todas las propiedades originales del objeto `tool`
      title: tool.Tipo || 'Sin título',
      amarca: tool.Marca || 'Sin marca',
      publisher: tool.Categoria || 'Sin categoría',
      synopsis: tool.Descripcion || 'Sin descripción',
      cover: tool.image || (tool.Portada ? this.getToolCoverUrl(tool) : '../../../../assets/LogoUTNG.png'),
      SERIE: tool.SERIE || 'No disponible',
      Cantidades: tool.Cantidades || 0,
      Modelo: tool.Modelo || 'No especificado',
      Categoria: tool.Categoria || 'No especificada'
    };
    this.showPreview = true; // Activar la vista previa
  }


  startMatchCountdown() {
    this.matchConfirmed = false;
    this.countdown = 5; // Reiniciar el contador a 5 segundos

    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(interval);
        this.matchConfirmed = true;
        this.openChat(); // Abre el chat automáticamente
      }
    }, 1000); // Actualiza cada segundo
  }

  openChat() {
    this.showChat = true;
    this.conversationStep = 0;
    this.registerActiveMatch(this.selectedTool);
    this.sendGreeting();
  }

  closeChat() {
    this.showChat = false;
    this.chatMessages = [];
  }

  sendMessage(): void {
  if (!this.newMessage.trim()) return;

  // Agrega el mensaje del usuario al chat
  this.chatMessages.push({ sender: 'Estudiante', text: this.newMessage });
  this.newMessage = '';

  // Guardar el chatMessages en el localStorage
  localStorage.setItem('chatMessages', JSON.stringify(this.chatMessages));

  // Simula que el propietario está escribiendo
  this.simulateTyping();

  // Genera la respuesta del propietario después de un retraso
  setTimeout(() => {
    this.handleUserMessage(this.chatMessages[this.chatMessages.length - 1].text);
    this.isTyping = false; // Detiene el estado de "escribiendo"
  }, 2000); // Retraso de 2 segundos
}


  // Simula que el propietario está escribiendo
  simulateTyping(): void {
    this.isTyping = true;
  }

  sendGreeting() {
    const timeZone = 'America/Santiago'; // Ajusta según tu zona horaria
    const now = new Date();
    const zonedTime = toDate(now, { timeZone }); // Convierte la fecha a la zona horaria específica
    const hour = zonedTime.getHours();
  
    const greeting = hour < 12 ? '¡Hola! Buenos días' : hour < 21 ? '¡Hola! Buenas tardes' : '¡Hola! Buenas noches';
    const ownerName = this.selectedTool.duenio;
  
    this.chatMessages.push({
      sender: `propietario(a)`,
      text: `${greeting}, soy ${ownerName}. Tengo este producto: ${this.selectedTool.name}. ¿Te interesa?`
    });
    this.conversationStep = 1;
  }
  

  

  handleUserMessage(message: string): void {
    const lowerMessage = message.trim().toLowerCase();
    let response = '';
    const ownerName = this.selectedTool.duenio || 'Propietario';

    // Ejemplo de flujo de conversación
    if (this.conversationStep === 1) {
      if (lowerMessage.includes('sí') || lowerMessage.includes('si') || lowerMessage.includes('interesado') || lowerMessage.includes('quiero')) {
        response = `¡Bacán! ¿Tienes alguna duda o vamos directo al intercambio?`;
        this.conversationStep = 2;
      } else if (lowerMessage.includes('no')) {
        response = `Todo bien, avísame si cambias de idea.`;
        this.conversationStep = 0;
      } else {
        response = `¿Entonces te interesa? Solo dime "sí" o "interesado".`;
      }
    } else if (this.conversationStep === 2) {
      if (lowerMessage.includes('no') || lowerMessage.includes('ninguna')) {
        response = `Perfecto. ¿Cuándo y dónde nos juntamos?`;
        this.conversationStep = 3;
      } else {
        response = `Buena onda. Está en buen estado, listo para usar. ¿Coordinamos lugar y hora?`;
        this.conversationStep = 3;
      }
    } else if (this.conversationStep === 3) {
      response = `¡Genial! Nos vemos ahí. Si pasa algo, me avisas.`;
      this.conversationStep = 0;
    }

    this.chatMessages.push({ sender: ownerName, text: response });
  }

  registerActiveMatch(tool: any): void {
    const newMatch = {
      toolId: tool.id,
      toolName: tool.name,
      status: 'activo',
      owner: tool.duenio
    };
    this.matchService.addActiveMatch(newMatch);
  }

  finalizeMatch(tool: any): void {
    this.matchService.moveToMatchHistory(tool);
  }
  










  
  ngOnInit() {
    this.searchTools(); // Realizar búsqueda inicial
  }

  searchTools() {
    this.loading = true;
    this.toolService.searchTools({
      busqueda: this.searchQuery,
      marca: this.selectedAmarca,
      categoria: this.selectedPublisher
    }).subscribe(
      (data) => {
        this.tools = data.map(tool => ({
          ...tool,
          Portada: tool.Portada ? new Uint8Array(tool.Portada.data) : null
        }));
        this.loading = false; // Desactivar pantalla de carga
      },
      (error) => {
        console.error('Error al buscar materiales académicos:', error);
        this.loading = false; // Desactivar pantalla de carga si hay error
      }
    );
    this.filteredTools = this.allTools.filter(tool => {
      const matchesCategory = this.selectedCategory === '' || tool.category === this.selectedCategory;
      const matchesType = this.selectedType === '' || tool.type === this.selectedType;
      return matchesCategory && matchesType;
    });
  }

  getToolCoverUrl(tool: any): SafeUrl {
    // Si `tool.image` está disponible, úsalo directamente
    if (tool.image) {
      return this.sanitizer.bypassSecurityTrustUrl(tool.image);
    }
  
    // Si `tool.image` no está disponible, manejar `tool.Portada`
    if (tool.Portada) {
      const blob = new Blob([new Uint8Array(tool.Portada)], { type: 'image/jpeg' });
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    }
  
    // Si no hay imagen ni portada, usar una imagen predeterminada
    return this.sanitizer.bypassSecurityTrustUrl('/assets/default-tool-cover.jpg');
  }
  

  closePreview() {
    this.showPreview = false;
  }

  openLoanForm(tool: any, event: any): void {
    event.stopPropagation();
    
    // Seleccionar herramienta y configurar valores
    this.selectedTool = tool;
    this.serie = tool.SERIE || 'No disponible';
    this.showPreview = false; // Ocultar la vista previa
    this.showLoanForm = true; // Mostrar formulario de préstamo
  
    // Mostrar alerta de contacto
    this.showContactingAlert = true;
  
    // Iniciar proceso de alerta y cuenta regresiva
    setTimeout(() => {
      this.showContactingAlert = false; // Ocultar alerta de contacto
      this.startMatchCountdown(); // Iniciar cuenta regresiva para el match
    }, 3000);
  }
  

  closeLoanForm(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showLoanForm = false;
    this.resetForm();
  }

  submitLoanForm() {
    // Aquí va el código de validación e intercambio
  }

  resetForm() {
    this.idEstudiante = 0;
    this.serie = '';
    this.fechaIntercambio = '';
    this.idUsuario = 0;
  }

  openEditModal(tool: any, event: Event) {
    event.stopPropagation();
    this.showPreview = false;

    if (!tool || !tool.SERIE) {
      console.error('Número de serie de la herramienta no proporcionado o inválido.');
      this.snackBar.open('No se puede editar: número de serie no proporcionado.', 'Cerrar', { duration: 3000 });
      return;
    }

    const modalRef = this.modalService.open(EditToolsComponent, { centered: true });
    modalRef.componentInstance.tool = {
      ...tool,
      Cantidades: tool.Cantidades || 0,
      Descripcion: tool.Descripcion || '',
      Modelo: tool.Modelo || '',
      Categoria: tool.Categoria || ''
    };

    modalRef.result.then((result) => {
      if (result === 'save' || result === 'delete') {
        this.searchTools(); // Refrescar lista
      }
    }).catch((error) => {
      console.warn('Modal cerrado sin guardar o con un error:', error);
    });
  }

  closeEmailWarning() {
    this.showEmailWarning = false;
  }
}