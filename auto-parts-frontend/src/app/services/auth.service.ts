import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean; // Add isAdmin field
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Updated with /api prefix
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  private initialized = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Prevent infinite loop by checking initialization
    if (!this.initialized && isPlatformBrowser(this.platformId)) {
      this.initialized = true;
      this.authStatusSubject.next(this.isAuthenticated());
    }
  }

 
updateAuthStatus(status: boolean): void {
  this.authStatusSubject.next(status);
}

login(credentials: { email: string; password: string }) {
  console.log('AuthService - Attempting login');
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      console.log('AuthService - Login response:', response);
      if (response?.token) {
        // Clear any existing data
        localStorage.clear();
        
        // Store new authentication data
        localStorage.setItem('token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          const isAdmin = response.user.isAdmin || response.user.email === 'lohassan123@gmail.com';
          localStorage.setItem('isAdmin', isAdmin.toString());
        }
        
        // Update authentication status
        this.updateAuthStatus(true);
        
        // Log success for debugging
        console.log('Login successful - Token and user data stored');
      } else {
        throw new Error('Invalid response format');
      }
    }),
    catchError(error => {
      console.error('AuthService - Login error:', error);
      this.updateAuthStatus(false);
      localStorage.clear();
      return throwError(() => error);
    })
  );
}

  signup(signupData: SignupData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/signup`, signupData, { headers }).pipe(
      tap(response => console.log('Signup successful:', response)),
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      this.removeToken();
      return false;
    }
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }

  // Add this method to handle logout more comprehensively
logout(): void {
  console.log('AuthService - Logging out');
  localStorage.clear();
  this.updateAuthStatus(false);
  this.router.navigate(['/login-signup']).then(() => {
    console.log('Redirected to login page');
  });
}
isLoggedIn(): boolean {
  if (!isPlatformBrowser(this.platformId)) return false;
  
  const token = this.getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isValid = payload.exp * 1000 > Date.now();
    return isValid;
  } catch {
    this.removeToken();
    return false;
  }
}

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = 'Invalid data. Please check your information.';
          break;
        case 401:
          errorMessage = 'Invalid email or password.';
          break;
        case 409:
          errorMessage = 'Email already exists.';
          break;
        case 422:
          errorMessage = 'Invalid input. Please check all fields.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
      }
    }

    console.error('Auth Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error
    });

    return throwError(() => errorMessage);
  }
  // Get current user data
getCurrentUser(): any {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Check if user is admin
isAdmin(): boolean {
  const user = this.getCurrentUser();
  return user?.isAdmin || user?.email === 'lohassan123@gmail.com';
}

// Check token expiration
isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
}
}