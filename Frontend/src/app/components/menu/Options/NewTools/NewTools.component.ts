import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../Services/ToolService';

@Component({
  selector: 'app-newtools',
  templateUrl: './NewTools.component.html',
  styleUrls: ['./NewTools.component.css']
})
export class NewToolsComponent {  
  material: { nombre: string, categoria: string } = { nombre: '', categoria: '' };
  marca: string = '';
  modelo: string = '';
  informacion: string = '';
  serie: string = '';
  ejemplares: number | null = null;
  portada: File | null = null;

  validateInput(): boolean {
    // Verificar que los campos no estén vacíos
    if (!this.material.categoria || !this.marca || !this.modelo) { // Cambia para verificar categoria
      return false;  // Si alguno está vacío, retorna false
    }
    return true;  // Todos los campos están llenos, retorna true
  }

  constructor(private toolService: ToolService, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.portada = file;
    }
  }

  saveTool() {
    console.log('Datos del Material antes de enviar:', {
      serie: this.serie,
      tipo: this.material.categoria, // Asegúrate de usar material.categoria aquí
      marca: this.marca,
      modelo: this.modelo,
      categoria: this.material.categoria,
      descripcion: this.informacion,
      cantidades: this.ejemplares,
      portada: this.portada ? this.portada.name : 'No seleccionada'
    });
  
    if (!this.serie || !this.material.categoria || !this.marca || !this.modelo || this.ejemplares === null) { // Cambia para verificar categoria
      alert('Todos los campos obligatorios deben ser completados.');
      return;
    }

    if (!this.marca.trim()) {
      alert('El campo "Marca" es obligatorio.');
      return;
    }

    if (!this.modelo.trim()) {
      alert('El campo "Modelo" es obligatorio.');
      return;
    }

    if (!this.material.categoria.trim()) { // Cambia para verificar categoria
      alert('El campo "Categoría" es obligatorio.');
      return;
    }

    if (this.material.categoria.length > 50 || this.marca.length > 50 || this.modelo.length > 50) {
      alert('Los campos Nombre_Material, Marca, Modelo y Categoría deben tener un máximo de 50 caracteres.');
      return;
    }

    if (!this.validateSERIE(this.serie)) {
      alert('El campo SERIE debe tener la estructura válida de un SERIE.');
      return;
    }

    if (this.ejemplares === null) {
      alert('El campo "Número de Cantidades Disponible" es obligatorio.');
      return;
    }

    if (this.ejemplares < 0) {
      alert('El "número Disponible" no puede ser menor que cero.');
      return;
    }

    const newTool = {
      serie: this.serie,
      tipo: this.material.categoria, // Asegúrate de usar material.categoria aquí
      marca: this.marca,
      modelo: this.modelo,
      categoria: this.material.categoria,
      descripcion: this.informacion || '',
      cantidades: this.ejemplares
    };

    this.toolService.addTool(newTool, this.portada).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        alert(response.message || 'Material guardado con éxito');
        this.router.navigate(['/menu']);
      },
      (error) => {
        console.error('Error durante el registro del Material:', error);
        if (error.error && error.error.message) {
          alert('Error: ' + error.error.message);
        } else {
          alert('Error durante el registro del Material');
        }
      }
    );
  }

  validateSERIE(serie: string): boolean { 
    const serieRegex = /^[a-zA-Z0-9]{4,14}$/;
    return serieRegex.test(serie);
  }

  confirmCancel() {
    if (confirm('¿Estás seguro de cancelar el registro?')) {
      this.router.navigate(['/menu']);
    }
  }
}
