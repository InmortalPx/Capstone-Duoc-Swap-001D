import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToolService } from '../Services/ToolService';

@Component({
  selector: 'app-edit-tools',
  templateUrl: './EditTools.component.html',
  styleUrls: ['./EditTools.component.css']
})
export class EditToolsComponent implements OnInit {
  @Input() tool: any;
  selectedFile: File | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private toolService: ToolService
  ) { }

  ngOnInit() {
    // Comprobar y registrar el número de serie
    console.log("Número de serie de la herramienta en edición:", this.tool.SERIE);
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveTool() {
    console.log('Material academico a actualizar:', JSON.stringify(this.tool, null, 2));
  
    if (!this.tool.SERIE || !this.tool.Tipo || !this.tool.Marca || !this.tool.Modelo || !this.tool.Categoria || this.tool.Cantidades === undefined) {
      console.log('Campos faltantes:', {
        SERIE: this.tool.SERIE,
        Tipo: this.tool.Tipo,
        Marca: this.tool.Marca,
        Modelo: this.tool.Modelo,
        Categoria: this.tool.Categoria,
        Cantidades: this.tool.Cantidades
      });
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
  
    this.tool.Cantidades = Number(this.tool.Cantidades);
  
    const formData = new FormData();
    Object.keys(this.tool).forEach(key => {
      if (key !== 'Portada') {
        formData.append(key, this.tool[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('portada', this.selectedFile, this.selectedFile.name);
    }

    this.http.put(`http://localhost:3000/updateTool/${this.tool.SERIE}`, formData).subscribe(
      (response) => {
        console.log('material actualizado con éxito', response);
        this.activeModal.close('save');
      },
      (error) => {
        console.error('Error al actualizar el material', error);
        alert('Error al actualizar el material: ' + (error.error.message || 'Ocurrió un error desconocido'));
      }
    );
  }

  deleteTool() {
    if (confirm('¿Estás seguro de que deseas eliminar esta herramienta?')) {
      this.toolService.deleteTool(this.tool.SERIE).subscribe({
        next: () => {
          alert('Herramienta eliminada exitosamente'); // Mensaje de eliminación exitosa
          this.activeModal.close('delete');
        },
        error: (err) => {
          console.error('Error al eliminar la herramienta:', err);
          alert(`Error al eliminar la herramienta: ${err.error?.message || 'Ocurrió un error desconocido'}`);
        }
      });
    }
  }
  

  close() {
    this.activeModal.dismiss('cancel');
  }
}