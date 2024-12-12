import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { ToolService } from '../Services/ToolService';

@Component({
  selector: 'app-newtools',
  templateUrl: './NewTools.component.html',
  styleUrls: ['./NewTools.component.css']
})
export class NewToolsComponent {  
  nombreHerramienta: string = '';
  marca: string = '';
  modelo: string = '';
  categoria: string = '';
  informacion: string = '';
  serie: string = '';
  ejemplares: number | null = null;
  portada: File | null = null;

  // Categorías predefinidas
  categorias: string[] = [
    'Ingeniería en Computación',
    'Diseño Gráfico',
    'Administración de Empresas',
    'Ingeniería en Informática',
    'Técnico en Enfermería',
    'Gastronomía',
    'Producción Audiovisual',
    'Ingeniería en Marketing',
    'Técnico en Prevención de Riesgos',
    'Diseño de Interiores',
    'Ingeniería en Construcción',
    'Técnico en Mecánica',
    'Técnico en Electricidad',
    'Técnico en Turismo',
    'Otra...'
  ];

  constructor(private toolService: ToolService, private router: Router) {}

  ngOnInit(): void {
    this.generateSerie(); // Generar el número de serie automáticamente al iniciar el componente
    this.generateModelo(); // Generar el modelo automáticamente
  }

  generateSerie(): void {
    const randomSerie = Math.random().toString(36).substring(2, 10).toUpperCase(); // Cadena alfanumérica de 8 caracteres
    this.serie = randomSerie;
  }

  generateModelo(): void {
    const randomModelo = Math.random().toString(36).substring(2, 10).toUpperCase(); // Cadena alfanumérica de 8 caracteres
    this.modelo = randomModelo;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.portada = file;
    }
  }

  validateInput(): boolean {
    // Verificar que los campos no estén vacíos
    return !!(this.nombreHerramienta && this.marca && this.modelo && this.categoria);
  }

  validateSERIE(serie: string): boolean { 
    const serieRegex = /^[A-Z0-9]{4,14}$/;
    return serieRegex.test(serie);
  }

  saveTool(): void {
    if (!this.serie || !this.nombreHerramienta || !this.marca || !this.modelo || !this.categoria || this.ejemplares === null) {
      alert('Todos los campos obligatorios deben ser completados.');
      return;
    }
  
    const newTool = {
      serie: this.serie,
      tipo: this.nombreHerramienta,
      marca: this.marca,
      modelo: this.modelo,
      categoria: this.categoria,
      descripcion: this.informacion || '',
      cantidades: this.ejemplares
    };
  
    // Intentar enviar los datos al backend
    this.toolService.addTool(newTool, this.portada).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        alert(response.message || 'Herramienta guardada con éxito');
        this.router.navigate(['/mis-publicaciones']); // Redirigir a "Mis Publicaciones"
      },
      (error) => {
        console.error('Error al enviar los datos al backend:', error);
        alert('El servidor no está disponible. Guardando localmente.');
  
        // Guardar en localStorage como sustituto
        this.saveToolToLocalStorage(newTool);
      }
    );
  }
  
  // Método auxiliar para guardar en localStorage
  saveToolToLocalStorage(tool: any): void {
    try {
      const toolsInLocalStorage = JSON.parse(localStorage.getItem('herramientas') || '[]');
      toolsInLocalStorage.push(tool);
      localStorage.setItem('herramientas', JSON.stringify(toolsInLocalStorage));
      console.log('Herramienta guardada en localStorage:', tool);
      alert('Herramienta guardada localmente como respaldo.');
      this.router.navigate(['/mis-publicaciones']); // Redirigir a "Mis Publicaciones"
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      alert('Error al guardar la herramienta localmente.');
    }
  }
  
  

  confirmCancel(): void {
    if (confirm('¿Estás seguro de cancelar el registro?')) {
      this.router.navigate(['/menuStudent']);
    }
  }
}
