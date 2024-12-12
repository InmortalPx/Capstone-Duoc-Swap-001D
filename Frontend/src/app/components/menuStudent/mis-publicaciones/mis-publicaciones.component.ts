import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EditToolsComponent } from '../../menu/Options/EditTools/EditTools.component';
import { ToolService } from '../../menu/Options/Services/ToolService';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.component.html',
  styleUrls: ['./mis-publicaciones.component.css']
})
export class MisPublicacionesComponent {
  searchQuery: string = '';
  selectedAmarca: string = '';
  selectedPublisher: string = '';
  tools: any[] = [];
  selectedTool: any = null;
  showLoanForm: boolean = false;
  showPreview: boolean = false;
  loading: boolean = false;
  showEmailWarning: boolean = false;

  idEstudiante: number = 0;
  serie: string = '';
  fechaIntercambio: string = '';
  idUsuario: number = 0;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private toolService: ToolService,
    private sanitizer: DomSanitizer,
    private router: Router // Inyectar Router
  ) {}

  ngOnInit() {
    this.searchTools(); // Realizar búsqueda inicial
  }

  // Navegar al menú principal
navigateToMenu(): void {
  this.router.navigate(['/menuStudent']);
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
  }

  getToolCoverUrl(tool: any): SafeUrl {
    if (tool.Portada) {
      const blob = new Blob([new Uint8Array(tool.Portada)], { type: 'image/jpeg' });
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    } else {
      return this.sanitizer.bypassSecurityTrustUrl('/assets/default-tool-cover.jpg');
    }
  }

  previewTool(tool: any) {
    this.selectedTool = {
      title: tool.Tipo,
      amarca: tool.Marca,
      publisher: tool.Categoria,
      synopsis: tool.Descripcion,
      cover: tool.Portada ? this.getToolCoverUrl(tool) : '../../../../assets/LogoUTNG.png',
      SERIE: tool.SERIE,
      Cantidades: tool.Cantidades || 0,
      Descripcion: tool.Descripcion || '',
      Modelo: tool.Modelo || '',
      Categoria: tool.Categoria || ''
    };
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
  }

  openLoanForm(tool: any, event: Event) {
    event.stopPropagation();
    this.showLoanForm = true;
    this.selectedTool = tool;
    this.serie = tool.SERIE;
    this.showPreview = false;
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
