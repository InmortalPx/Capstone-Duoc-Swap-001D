import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(): boolean {
    // Desactivar la verificación de autenticación
    // Permitir acceso sin verificar si el usuario está autenticado
    return true; // Permitir el acceso sin restricciones
  }
}
