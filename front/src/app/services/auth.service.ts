import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de ton API Symfony
  
  constructor(private http: HttpClient, private router: Router) {}

   // Méthode de connexion
   login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login_check`, credentials).pipe(
      tap((response: any) => {
        // Stocker le token dans LocalStorage ou un Cookie
        if (response.token) {
          // Option 1: Stocker dans LocalStorage
          localStorage.setItem('token', response.token);

          // Option 2: Stocker dans un Cookie
          document.cookie = `BEARER=${response.token}; path=/; secure; httponly`;

          // Rediriger vers le dashboard après la connexion
          this.router.navigate(['/home-user']);
        }
      })
    );
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    // Option 1: Vérifier le token dans LocalStorage
    return !!localStorage.getItem('token');

    // Option 2: Vérifier le token dans les Cookies
    // return document.cookie.includes('BEARER=');
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token de LocalStorage
    // ou supprimer le cookie
    document.cookie = 'BEARER=; Max-Age=0; path=/; secure; httponly'; // Invalider le cookie

    this.router.navigate(['/login']);
  }
}



