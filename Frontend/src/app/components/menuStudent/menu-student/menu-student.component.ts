import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarService } from '../../menu/Options/Services/sidebar.services';

@Component({
  selector: 'app-menu-student',
  templateUrl: './menu-student.component.html',
  styleUrls: ['./menu-student.component.css']
})
export class MenuStudentComponent {
  isSidebarHidden = false;
  isFooterVisible = false;
  activeSection = 'noticias'; // Sección activa inicial
  isDropdownVisible = false;
  showNoticias = true;
  noticiasItems: any[] = [];

  constructor(
    private sidebarService: SidebarService, 
    private http: HttpClient, 
    private router: Router
  ) {
    this.sidebarService.sidebarHidden$.subscribe(hidden => this.isSidebarHidden = hidden);
    this.cargarNoticias();
  }

  ngOnInit(): void {
    console.log("MenuStudentComponent inicializado correctamente");
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  showSection(section: string) {
    this.activeSection = section;
    this.resetViews();
  }

  showInicioSection() {
    this.activeSection = 'noticias';
    this.showNoticias = true;
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  closeDropdown() {
    this.isDropdownVisible = false;
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
    this.showNoticias = false;
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

