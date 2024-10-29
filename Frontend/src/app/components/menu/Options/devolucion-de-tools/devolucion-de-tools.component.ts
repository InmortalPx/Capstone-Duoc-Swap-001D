import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-devolucion-de-tools',
  templateUrl: './devolucion-de-tools.component.html',
  styleUrls: ['./devolucion-de-tools.component.css'],
  animations: [
    trigger('fadeOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      transition(':leave', [
        animate(300)
      ])
    ])
  ]
})
export class DevolucionDeToolsComponent implements OnInit {
  loans: any[] = [];
  loading: boolean = false;
  searchControl: string = '';
  searchTitle: string = '';
  searchSERIE: string = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadLoans(); // Cargar los intercambios al iniciar
  }

  loadLoans() {
    this.loading = true;
    this.http.get<any>('http://localhost:3000/loans')
      .subscribe(
        (data) => {
          this.loans = data;
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar intercambios:', error);
          this.loading = false;
        }
      );
  }

  returnTool(loanId: number, SERIE: string) {
    const index = this.loans.findIndex(loan => loan.id === loanId);
    if (index !== -1) {
      // Eliminar el intercambio de la lista antes de hacer la solicitud
      const loanToRemove = this.loans[index];
      this.loans.splice(index, 1);

      this.http.delete(`http://localhost:3000/returnTool/${loanId}`)
        .subscribe(
          (response) => {
            this.snackBar.open('Material academico registrado exitosamente', 'Cerrar', { duration: 3000 });
          },
          (error) => {
            console.error('Error al devolver el material academico:', error);
            this.snackBar.open('Error al devolver el material de intercambio', 'Cerrar', { duration: 3000 });
            // Revertir la eliminación si hay un error
            this.loans.splice(index, 0, loanToRemove);
          }
        );
    }
  }

  filterLoans() {
    return this.loans.filter(loan => {
      const matchesControl = loan.IdEstudiante.includes(this.searchControl);
      const matchesTitle = loan.Tipo.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesSERIE = loan.SERIE.includes(this.searchSERIE); // Filtrar por SERIE
      return matchesControl && matchesTitle && matchesSERIE;
    });
  }
}