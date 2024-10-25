import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';
  private currentUserProfile: any = null;

  constructor(private http: HttpClient) {}

  // Récupération des headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer les informations d'un utilisateur spécifique
  getUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

   // Compléter le profil de l'utilisateur
   completeProfile(userData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/complete-profile`, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer le profil de l'utilisateur actuellement connecté
  getUserProfile(): Observable<any> {
    if (this.currentUserProfile) {
      return of(this.currentUserProfile);
    }
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/user/profile`, { headers }).pipe(
      tap((profile) => this.currentUserProfile = profile),
      catchError(this.handleError)
    );
  }

  // Mettre à jour les informations utilisateur
  updateUserInfo(userData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/update-info`, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Changer le mot de passe de l'utilisateur
  changePassword(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${environment.apiUrl}/user/change-password`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer le compte utilisateur avec confirmation
  deleteAccount(): Observable<any> {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');
    if (confirmation) {
      const headers = this.getAuthHeaders();
      return this.http.delete(`${environment.apiUrl}/user/delete-account`, { headers }).pipe(
        catchError(this.handleError)
      );
    }
    return throwError('Suppression annulée par l\'utilisateur.');
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.status === 401) {
      errorMessage = 'Vous n\'êtes pas autorisé. Veuillez vous reconnecter.';
    } else if (error.status === 500) {
      errorMessage = 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
    }
    console.error('Erreur:', error);
    return throwError(errorMessage);
  }
}









/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl + '/users'; // Utilisation de l'URL de base depuis l'environnement

  constructor(private http: HttpClient) {}

  // Récupérer les informations d'un utilisateur spécifique par ID
  getUser(id: number): Observable<any> {
    const token = localStorage.getItem('token'); // Récupération du token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour les informations d'un utilisateur spécifique
  updateUser(id: number, userData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // Récupération du token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer le profil de l'utilisateur actuellement connecté (nécessite un token) 1
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Utilisation directe de l'endpoint /user/profile sans passer par /users
    return this.http.get(`${environment.apiUrl}/user/profile`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
   
  // Mettre à jour les informations personnelles de l'utilisateur (nécessite un token)
  updateUserInfo(userInfo: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Ajustement du chemin pour la mise à jour, si l'URL est différente côté Symfony, modifie ce chemin
    return this.http.put(`${this.apiUrl}/update`, userInfo, { headers }).pipe(
      catchError(this.handleError)
    );
  }
 

  // Changer le mot de passe de l'utilisateur (nécessite un token) 3
  changePassword(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Utilisation de l'endpoint défini pour le changement de mot de passe
    return this.http.post(`${environment.apiUrl}/user/change-password`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer le compte utilisateur (nécessite un token) 2
  deleteAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Utilisation de l'endpoint défini pour la suppression de compte
    return this.http.delete(`${environment.apiUrl}/user/delete-account`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }
}*/
