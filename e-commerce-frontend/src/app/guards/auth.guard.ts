import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const role = this.authService.getRole();

    // Condition de redirection selon le rôle
    if (route.routeConfig?.path === 'client/dashboard' && role !== 'client') {
      this.router.navigate(['/login']);
      return false;
    } else if (route.routeConfig?.path === 'seller/dashboard' && role !== 'seller') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
