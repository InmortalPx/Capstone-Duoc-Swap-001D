import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginStudentComponent } from '../menuStudent/loginStudent/loginStudent.component';
import { SidebarService } from '../menu/Options/Services/sidebar.services';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isSidebarHidden = false;
  showSearch = false;
  showNewTools = false;
  showChats = false;
  showRegistro = false;
  showRegistroStudent = false;
  showEstudiantes = false;
  showReporte = false;
  showNoticias = true;
  noticiasItems: any[] = [];
  constructor(private modal: NgbModal, private sidebarService: SidebarService, private http: HttpClient, private router: Router) {
    this.sidebarService.sidebarHidden$.subscribe(hidden => this.isSidebarHidden = hidden);
    this.cargarNoticias();

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

  showRegistroUsuarios() {
    this.resetViews();
    this.showRegistro = true;
  }

  

  toggleRegisterStudent() {
    this.resetViews();
    this.showRegistroStudent = true;
  }

  showRegistroEstudiantes() {
    this.resetViews();
    this.showEstudiantes = true;
  }

  showPersonalisado(){
    this.resetViews();
    this.showReporte = true;
  }
  redirectToHome() {
    this.resetViews();
    // Redirigir al apartado de inicio (home)
    window.location.href = '#welcome';
  }

  showNoticiasSection() {
    this.resetViews();
    this.showNoticias = true;
  }

  private resetViews() {
    this.showSearch = false;
    this.showNewTools = false;
    this.showChats = false;
    this.showRegistro = false;
    this.showEstudiantes = false;
    this.showReporte = false;
    this.showNoticias = false;
  }

  openModal() {
    const modalRef = this.modal.open(LoginComponent, {
      backdrop: 'static',
      size: 'md',
      centered: true
    });
  }

  openModal2() {
    const modalRef = this.modal.open(LoginStudentComponent, {
      backdrop: 'static',
      size: 'md',
      centered: true
    });
  }

  private cargarNoticias() {
    this.noticiasItems = [
      {
        titulo: "Nuestra colección de Material Educativo",
        contenido: "DuocSwap ha incorporado una amplia variedad de materiales educativos para facilitar el aprendizaje y el intercambio entre estudiantes. Desde libros de texto hasta equipos de laboratorio, todo está disponible para el intercambio en nuestra plataforma.",
        imagen: "https://st2.depositphotos.com/3827765/5416/v/950/depositphotos_54166089-stock-illustration-set-of-16-school-thing.jpg"
      },
      {
        titulo: "Nuestro sistema de intercambio",
        contenido: "Recuerde que contamos con un programa de orientación para los estudiantes sobre el uso adecuado de la plataforma DuocSwap, enfocado en mejorar la experiencia de intercambio y la seguridad en las transacciones.",
        imagen: "https://www.uc.cl/site/assets/files/21753/estudiantes_uso_ia.700x532.jpg"
      },
      {
        titulo: "Acceso y disponibilidad",
        contenido: "Los materiales educativos están disponibles para intercambio en cualquier momento a través de la plataforma DuocSwap. Nuestro objetivo es asegurar que todos los estudiantes cuenten con los recursos necesarios para su aprendizaje de manera eficiente y colaborativa.",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiCOLtXcov0STz6tz5sjDm-ZVp1ZIpDjuKQ&s"
      }
    ];
  }
}
