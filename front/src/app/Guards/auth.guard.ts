import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // On injecte le service AuthService
  const router = inject(Router);            // On injecte le service Router

  if (authService. isAuthenticated()) {
    return true;  // L'utilisateur est connecté, il peut accéder à la route
  } else {
    router.navigate(['/login']);  // Redirige vers la page de connexion
    return false;  // L'accès est refusé
  }
  return true;
};
