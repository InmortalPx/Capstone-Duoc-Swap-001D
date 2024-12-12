import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarService } from '../../menu/Options/Services/sidebar.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilComponent } from '../perfil/perfil.component';

@Component({
  selector: 'app-menu-student',
  templateUrl: './menu-student.component.html',
  styleUrls: ['./menu-student.component.css']
})
export class MenuStudentComponent {
  menuItems = [
    { label: 'Intercambios', section: 'search-tools', icon: 'swap_horiz' },
    { label: 'Mi Perfil', section: 'perfil', icon: 'person' },
    { label: 'Foro', section: 'noticias', icon: 'newspaper' },
    { label: 'Mis Matches', section: 'matches', icon: 'favorite' },
    { label: 'Match Activos', section: 'match-activos', icon: 'star'},
    { label: 'Chats', section: 'chats', icon: 'chat' },
    { label: 'Ayuda y Soporte', section: 'ayuda', icon: 'help' },
    { label: 'Nuevo Material', section: 'newtools', icon: 'add' },
    { label: 'Mis publicaciones', section: 'mis-publicaciones', icon: 'folder' },
  ];
  
  isSidebarHidden = false;
  isFooterVisible = false;
  activeSection = 'search-tools'; // Sección activa inicial
  isDropdownVisible = false;
  isMobileMenuVisible = false; // Nueva propiedad para el menú móvil
  showNoticias = true;
  noticiasItems: any[] = [];
  showSearch = false;
  showNewTools = false;
  showChats = false;

  constructor(
    private sidebarService: SidebarService, 
    private http: HttpClient, 
    private router: Router,
    private modalService: NgbModal // Agrega esto
) {
  this.sidebarService.sidebarHidden$.subscribe(hidden => this.isSidebarHidden = hidden);
}


ngOnInit(): void {
  console.log("MenuStudentComponent inicializado correctamente");
  if (localStorage.getItem('IdEstudiante')) { // Condición para abrir el perfil si el IdEstudiante está presente
    this.openProfileModal();
  }
}

openProfileModal() {
  const modalRef = this.modalService.open(PerfilComponent);
  modalRef.componentInstance.username = localStorage.getItem('username'); // Pasa el nombre de usuario al componente de perfil
}
  

  toggleMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible; // Alternar visibilidad del menú móvil
  }

  showSection(section: string) {
    this.activeSection = section;
    this.resetViews();
    this.isMobileMenuVisible = false; // Ocultar el menú móvil al seleccionar una sección
  
    if (section === 'perfil') {
      this.openProfileModal(); // Abrir modal de perfil
    }
  }
  

  showInicioSection() {
    this.router.navigate(['/inicio']); // Navegar a la sección de inicio
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
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
    this.showNoticias = false;
  }
}