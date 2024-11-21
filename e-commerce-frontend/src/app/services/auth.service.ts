import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Remplacez avec votre URL d'authentification

  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Sauvegarde le jeton JWT et le rôle utilisateur
        this.setToken(response.token);
        this.setRole(response.User_Role); // ex : "client" ou "seller"
      }),
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token'); // Ou utilisez sessionStorage si vous préférez
    if (token) {
      // Optionnel : vérifier si le token est expiré
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isTokenExpired = payload.exp * 1000 < Date.now();
      if (isTokenExpired) {
        // Si le token est expiré, l'utilisateur n'est pas authentifié
        return false;
      }
      return true; // Le token est valide et l'utilisateur est authentifié
    }
    return false; // Pas de token, donc non authentifié
  }
  
  logout(): void {
    this.removeToken();
    this.removeRole();
    this.router.navigate(['/client/dashboard']);
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId'); // Récupère l'ID de l'utilisateur du stockage local
  }
  setUserId(id: string): void {
    this.userId = id;
    localStorage.setItem('userId', id);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  signup(signupData: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, signupData).pipe(
      tap((response) => {
        console.log('Signup successful', response);
      }),
      catchError(this.handleError)
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log(token);
    
    // Définir un temps d'expiration pour le jeton
    const expirationDate = new Date(Date.now() + 3600000); // 1 heure d'expiration
    localStorage.setItem('tokenExpirationDate', expirationDate.toString());
  }

  private setRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  private removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
  }

  private removeRole(): void {
    localStorage.removeItem('userRole');
  }

  private isTokenExpired(): boolean {
    const expirationDate = new Date(localStorage.getItem('tokenExpirationDate') || '');
    return expirationDate < new Date();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Gérer les erreurs HTTP de manière appropriée
    if (error.status === 401) {
      return throwError('Nom d\'utilisateur ou mot de passe incorrect.');
    } else {
      return throwError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  }
}