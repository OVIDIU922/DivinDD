import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  //private apiUrl = 'http://127.0.0.1:8000/api/register'; // URL de votre API Symfony
  private apiUrl = 'https://api.divindd.wip/api/register'; // URL de ton API Symfony


  constructor(private http: HttpClient, private router: Router) {}

   // Méthode pour l'inscription
   register(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, user, { headers });
  }

    /*register(user: User): Observable<any> {
      return this.http.post<any>('http://127.0.0.1:8000/api/register', user, {
          headers: { 'Content-Type': 'application/json' }
      });
    }*/
}
