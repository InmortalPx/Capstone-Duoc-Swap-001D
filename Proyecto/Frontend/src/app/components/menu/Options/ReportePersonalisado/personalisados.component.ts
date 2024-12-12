import { Component, OnInit } from '@angular/core';
import { IntercambioService } from './../../Options/Services/reporte.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-personalizado',
  templateUrl: './personalisado.component.html',
  styleUrls: ['./personalisado.component.css'],
})
export class PersonalisadoComponent implements OnInit {
  intercambios: any[] = [];
  mensajeDeError: string | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';

  columnasDisponibles = [
    { name: 'ID Intercambio', field: 'IdIntercambio', selected: true },
    { name: 'Número de Control', field: 'IdEstudiante', selected: true },
    { name: 'Nombre del Estudiante', field: 'NombreEstudiante', selected: true },
    { name: 'Correo del Estudiante', field: 'CorreoEstudiante', selected: true },
    { name: 'SERIE', field: 'SERIE', selected: true },
    { name: 'Tipo de la Material', field: 'TipoMaterial', selected: true },
    { name: 'Marca de la Material', field: 'MarcaMaterial', selected: true },
    { name: 'ID Usuario', field: 'IdUsuario', selected: true },
    { name: 'Fecha de Intercambio', field: 'FechaIntercambio', selected: true },
    { name: 'Estado del Intercambio', field: 'Estado', selected: true }
  ];

  constructor(private intercambioService: IntercambioService) {}

  ngOnInit(): void {
    this.cargarIntercambios();
  }

  actualizarReporte(): void {
    this.cargarIntercambios();
  }

  cargarIntercambios() {
    this.intercambioService.getIntercambios(this.fechaInicio, this.fechaFin).subscribe(
      (data) => {
        if (data.length === 0) {
          this.mensajeDeError = 'No se encontraron materiales de intercambio disponible.';
        } else {
          this.intercambios = data;
          this.mensajeDeError = null;
        }
      },
      (error) => {
        this.mensajeDeError =
          'Hubo un problema al cargar los materiales de intercambio. Por favor, intenta nuevamente más tarde.';
      }
    );
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    let y = 10;

    // Generar encabezados del PDF basados en las columnas seleccionadas
    let x = 10;
    this.columnasDisponibles.forEach(column => {
      if (column.selected) {
        doc.text(column.name, x, y);
        x += 40; // Ajusta el espaciado horizontal entre columnas
      }
    });

    y += 10; // Salto de línea después del encabezado

    // Generar datos de las filas del PDF basados en las columnas seleccionadas
    this.intercambios.forEach(intercambio => {
      x = 10;
      this.columnasDisponibles.forEach(column => {
        if (column.selected) {
          doc.text(String(intercambio[column.field]), x, y);
          x += 40; // Ajusta el espaciado horizontal entre columnas
        }
      });
      y += 10; // Salto de línea después de cada fila
    });

    doc.save('reporte_intercambios.pdf');
  }
}