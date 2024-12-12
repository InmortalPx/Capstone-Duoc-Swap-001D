import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatchService } from '../../menu/Options/Services/match.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit, OnDestroy {
  matchHistory: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    // Suscribirse al historial de matches
    const historySubscription = this.matchService.matchHistory$.subscribe({
      next: (history) => {
        console.log('Historial de matches recibido:', history);
        this.matchHistory = history.map(match => ({
          ...match,
          confirmationDate: match.confirmationDate || this.generateRandomDate()
        }));
      },
      error: (err) => {
        console.error('Error al cargar el historial de matches:', err);
      }
    });

    this.subscription.add(historySubscription);
  }

  ngOnDestroy(): void {
    // Asegurarse de cancelar las suscripciones
    this.subscription.unsubscribe();
  }

  // Generador de fechas simuladas
  private generateRandomDate(): Date {
    const start = new Date(2024, 0, 1); // 1 de enero de 2024
    const end = new Date(2024, 11, 31); // 31 de diciembre de 2024
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Método para eliminar un match
  deleteMatch(matchId: string): void {
    this.matchService.deleteMatch(matchId);
  }
}
