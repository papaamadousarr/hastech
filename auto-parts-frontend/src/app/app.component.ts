import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';

// Import your components
import { HeaderComponent } from './header/header.component';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { SliderComponent } from './slider/slider.component';
import { CategoriesComponent } from './categories/categories.component';
import { VehicleBrandSelectionComponent } from './vehicle-brand-selection/vehicle-brand-selection.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    RouterModule,
    HeaderComponent,
    SliderComponent,
    VehicleSearchComponent,
    VehicleBrandSelectionComponent,
    FooterComponent,
    HttpClientModule,
    ProductDetailComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Allo Piece Auto';
  categories: { slug: string; icon: string; name: string }[] = [];
  selectedBrand: string | null = null;

  constructor(
    private router: Router, 
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user is logged in and on login page
    if (this.authService.isLoggedIn() && 
        this.router.url === '/login-signup') {
      this.router.navigate(['/account']);
    }
  }

  isHomeRoute(): boolean {
    return this.router.url === '/';
  }

  isAccountRoute(): boolean {
    const currentRoute = this.router.url;
    // If user is logged in and tries to access login-signup, redirect to account
    if (this.authService.isLoggedIn() && currentRoute.includes('login-signup')) {
      this.router.navigate(['/account']);
      return false;
    }
    return currentRoute.includes('account') || 
           (!this.authService.isLoggedIn() && currentRoute.includes('login-signup'));
  }

  isCategoryRoute(): boolean {
    return this.router.url.includes('/category');
  }

  onSearchComplete(searchData: any) {
    if (searchData.type === 'search') {
      // Navigate to search results page with the search data
      this.router.navigate(['/search-results'], { 
        queryParams: { 
          brand: searchData.brand,
          model: searchData.model,
          year: searchData.year
        }
      });
    }
  }
}