import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToolService } from '../Services/ToolService';
import { EditToolsComponent } from '../EditTools/EditTools.component';

@Component({
  selector: 'app-search-tools',
  templateUrl: './search-tools.component.html',
  styleUrls: ['./search-tools.component.css']
})
export class SearchToolsComponent implements OnInit {
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
  fechaDevolucion: string = '';
  idUsuario: number = 0;

  amarcas: string[] = [];
  publishers: string[] = [];
  estudiantes: any[] = [];
  filteredEstudiantes: any[] = [];

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private toolService: ToolService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.cargarMarcasYEditoriales();
    this.cargarEstudiantes(); 
  }

  cargarEstudiantes() {
    this.http.get<any>('http://localhost:3000/estudiante').subscribe(
      (data) => {
        this.estudiantes = data;
        this.filteredEstudiantes = data; 
      },
      (error) => console.error('Error al cargar Estudiantes:', error)
    );
  }
  
  filterEstudiantes() {
    this.filteredEstudiantes = this.estudiantes.filter(estudiante=>
      estudiante.IdEstudiante.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      estudiante.NombreCompleto.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  cargarMarcasYEditoriales() {
    this.http.get<any>('http://localhost:3000/api/materials/marcas-editoriales').subscribe(
      (data) => {
        this.amarcas = data.marcas;
        this.publishers = data.editoriales;
      },
      (error) => console.error('Error al cargar marcas y editoriales:', error)
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
        this.loading = false;
      },
      (error) => {
        console.error('Error al buscar materiales academicos:', error);
        this.loading = false;
      }
    );
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
    // Verificar si el número de control es válido
    if (!this.idEstudiante || this.idEstudiante <= 0) {
        this.snackBar.open('Ingresa un número de control válido', 'Cerrar', { duration: 3000 });
        return;
    }

    // Verificar si el ID del usuario es válido
    if (!this.idUsuario || this.idUsuario <= 0) {
        this.snackBar.open('Usuario no registrado', 'Cerrar', { duration: 3000 });
        return;
    }

    if (!this.fechaIntercambio || !this.fechaDevolucion) {
        this.snackBar.open('Las fechas de intercambio y devolución son requeridas', 'Cerrar', { duration: 3000 });
        return;
    }

    if (this.selectedTool.Cantidades <= 0) {
        this.snackBar.open('No hay stock disponibles para prestar', 'Cerrar', { duration: 3000 });
        return;
    }

    this.http.get(`http://localhost:3000/estudiante/${this.idEstudiante}`).subscribe(
        (estudiante: any) => {
            if (!estudiante.CorreoConfirmado) {
                this.showEmailWarning = true;
            }

            const loanData = {
                idEstudiante: this.idEstudiante,
                serie: this.selectedTool.SERIE,
                fechaIntercambio: this.fechaIntercambio,
                fechaDevolucion: this.fechaDevolucion,
                idUsuario: this.idUsuario,
            };

            console.log('Datos del intercambio a enviar:', loanData);

            this.http.post('http://localhost:3000/loanTool', loanData).subscribe(
                (response: any) => {
                    this.snackBar.open(response.message, 'Cerrar', { duration: 3000 });
                    this.closeLoanForm();
                    this.searchTools();

                    const updateData = {
                        Cantidades: this.selectedTool.Cantidades - 1
                    };

                    this.http.put(`http://localhost:3000/updateTool/quantity/${this.selectedTool.SERIE}`, updateData).subscribe(
                        (updateResponse) => {
                            console.log('Cantidad de materiales academicos actualizada:', updateResponse);
                        },
                        (error) => {
                            console.error('Error al actualizar la cantidad de materiales:', error);
                        }
                    );
                },
                (error) => {
                    console.error('Error al registrar el intercambio:', error);
                    this.snackBar.open(error.error.message || 'Error al registrar el intercambio', 'Cerrar', { duration: 3000 });
                }
            );
        },
        (error) => {
            console.error('Error al obtener el Estudiante:', error);
            this.snackBar.open('Error al verificar el estado del Estudiante', 'Cerrar', { duration: 3000 });
        }
    );
  }

  resetForm() {
    this.idEstudiante = 0;
    this.serie = '';
    this.fechaIntercambio = '';
    this.fechaDevolucion = '';
    this.idUsuario = 0;
  }

  openEditModal(tool: any, event: Event) {
    event.stopPropagation();
    this.showPreview = false;
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
            this.searchTools();
        }
    }, (_reason) => {
        console.log('Modal cerrado');
    });
  }

  closeEmailWarning() {
    this.showEmailWarning = false;
  }
}