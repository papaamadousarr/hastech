import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  goToCategories() {
    this.router.navigate(['/categories']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToVehicleSearch() {
    this.router.navigate(['/vehicle-search']);
  }

  goToLogin() {
    this.router.navigate(['/login-signup']);
  }
}