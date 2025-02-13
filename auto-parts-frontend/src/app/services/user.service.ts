import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isConfirmed: boolean;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserProfile(): Observable<UserProfile> {
    console.log('Getting user profile');
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: any) => {
        console.log('Profile response:', response);
      }),
      catchError(this.handleError)
    );
  }

  updateUserProfile(updates: Partial<UserProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/profile`, updates, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.status) {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 404:
          errorMessage = 'Profile not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  addAddress(address: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/address`, { fullAddress: address }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/address/${addressId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  loadUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }
}