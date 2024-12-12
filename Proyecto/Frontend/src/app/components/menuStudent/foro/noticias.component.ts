import { Component, HostListener } from '@angular/core';
import { SidebarService } from '../../menu/Options/Services/sidebar.services';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Comentario {
    nombre: string;
    texto: string;
}

interface Post {
    usuario: string;
    contenido: string;
    fecha: Date;
    imagen?: string;
    reacciones: string[];
    comentarios: Comentario[];
    nuevoComentario?: string;
    mostrarComentarios?: boolean;
}

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent {
  isSidebarHidden = false;
  posts: Post[] = [];
  nuevoPostContenido: string = '';
  activeSection = 'noticias'; // Sección activa inicial
  mostrarCrearPublicacion: boolean = false;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  nombreEstudiante: string = 'Estudiante'; // Nombre del estudiante, puedes cambiarlo dinámicamente
  showSearch = false;
  showNewTools = false;
  showChats = false;
  noticiasItems: any[] = [];
  showNoticias = true;
  isFooterVisible = false;

  constructor(
    private sidebarService: SidebarService, 
    private http: HttpClient, 
    private router: Router
  ) {
    this.sidebarService.sidebarHidden$.subscribe(hidden => this.isSidebarHidden = hidden);
    this.cargarNoticias();
  }

  toggleCrearPublicacion() {
    this.mostrarCrearPublicacion = !this.mostrarCrearPublicacion;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string; // Establecer la vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  }

  crearNuevaPublicacion() {
    if (this.nuevoPostContenido) {
      const nuevoPost: Post = {
        usuario: this.nombreEstudiante,
        contenido: this.nuevoPostContenido,
        fecha: new Date(),
        imagen: this.imagenPreview || undefined,
        reacciones: [],
        comentarios: [],
        mostrarComentarios: false
      };
      this.posts.push(nuevoPost);
      this.nuevoPostContenido = '';
      this.mostrarCrearPublicacion = false;
      this.imagenSeleccionada = null; // Resetea la imagen
      this.imagenPreview = null; // Resetea la vista previa
    }
  }

  reactToPost(post: Post, reaccion: string) {
    if (!post.reacciones.includes(reaccion)) {
      post.reacciones.push(reaccion);
    }
  }

  quitarReaccion(post: Post, reaccion: string) {
    const index = post.reacciones.indexOf(reaccion);
    if (index > -1) {
      post.reacciones.splice(index, 1);
    }
  }

  toggleComentarios(post: Post) {
    post.mostrarComentarios = !post.mostrarComentarios;
  }

  showSection(section: string) {
    this.activeSection = section;
    this.resetViews();
  }

  showSearchTools() {
    this.resetViews();
    this.showSearch = true;
  }

  showNewTool() {
    this.resetViews();
    this.showNewTools = true;
  }

  showChat() {
    this.resetViews();
    this.showChats = true;
  }

  showInicioSection() {
    this.activeSection = 'noticias';
    this.showNoticias = true;
  }

  comentar(post: Post) {
    if (post.nuevoComentario) {
      const nuevoComentario: Comentario = {
        nombre: this.nombreEstudiante,
        texto: post.nuevoComentario
      };
      post.comentarios.push(nuevoComentario);
      post.nuevoComentario = ''; // Resetea el campo de comentario
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.clientHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    this.isFooterVisible = windowBottom >= docHeight;
  }

  private resetViews() {
    this.showSearch = false;
    this.showNewTools = false;
    this.showChats = false;
  }

  private cargarNoticias() {
    this.noticiasItems = [
      {
        tipo: "Nuestra colección de Material Educativo",
        contenido: "DuocSwap ha incorporado una amplia variedad de materiales educativos...",
        imagen: "https://st2.depositphotos.com/3827765/5416/v/950/depositphotos_54166089-stock-illustration-set-of-16-school-thing.jpg"
      },
      {
        tipo: "Nuestro sistema de intercambio",
        contenido: "Recuerde que contamos con un programa de orientación...",
        imagen: "https://www.uc.cl/site/assets/files/21753/estudiantes_uso_ia.700x532.jpg"
      },
      {
        tipo: "Acceso y disponibilidad",
        contenido: "Los materiales educativos están disponibles para intercambio en cualquier momento...",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiCOLtXcov0STz6tz5sjDm-ZVp1ZIpDjuKQ&s"
      }
    ];
  }
}