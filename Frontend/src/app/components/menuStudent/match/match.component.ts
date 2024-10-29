import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../menu/Options/Services/match.service';
import { Match } from '../../menu/Options/models/users.model';
import { Router } from '@angular/router'; // Importar Router para la navegación

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  tuId: string = '';
  idUsuario: string = '';
  serieProducto: string = '';
  historialMatches: Match[] = [];

  constructor(private matchService: MatchService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerHistorialMatches();
  }

  hacerMatch(): void {
    this.matchService.crearMatch(this.tuId, this.idUsuario, this.serieProducto).subscribe(
      response => {
        alert('Match realizado con éxito');
        this.obtenerHistorialMatches();
      },
      (error: any) => {
        console.error(error);
        alert('Error al realizar el match: ' + (error.error?.message || error.message));
      }
    );
  }

  obtenerHistorialMatches(): void {
    this.matchService.obtenerHistorial(this.tuId).subscribe(
      (data: Match[]) => {
        this.historialMatches = data;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  iniciarChat(match: Match): void {
    // Redirigir al chat con el match seleccionado
    this.router.navigate(['/mensaje', { user1Id: match.User1Id, user2Id: match.User2Id }]);
  }
} 