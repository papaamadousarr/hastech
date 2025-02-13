import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('AuthGuard - Checking authentication for route:', state.url);
    
    if (this.authService.isLoggedIn()) {
      // Check if trying to access login page while already logged in
      if (state.url === '/login-signup') {
        console.log('AuthGuard - Already logged in, redirecting to account');
        this.router.navigate(['/account']);
        return of(false);
      }
      
      console.log('AuthGuard - User is authenticated');
      return of(true);
    }
  
    // If not authenticated and trying to access protected route
    if (state.url !== '/login-signup') {
      console.log('AuthGuard - User is not authenticated, redirecting to login');
      this.router.navigate(['/login-signup'], {
        queryParams: { returnUrl: state.url }
      });
    }
    
    return of(false);
  }
}
