import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { CategoriesComponent } from '../categories/categories.component';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  imageUrl: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  userName: string | null = null;
  searchTerm: string = '';
  cartItemCount: number = 0;
  showCategoriesDropdown: boolean = false;
  isCartOpen: boolean = false;
  isOpen = false;
  activeCategory: number | null = null;
  activeCategoryImage: string | null = null;
  timeout: any = null;

  categories: Category[] = [
    {
      id: 16,
      name: 'Filters',
      slug: 'filters',
      icon: 'https://bcdn.aloparca.com/category/icons/10105.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10105.png'
    },
    {
      id: 19,
      name: 'Oils & Fluids',
      slug: 'oils-and-fluids',
      icon: 'https://bcdn.aloparca.com/category/icons/01J7ATJZJEGRFB4AE2Q82XCDCW.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/01J7ATK5G0KQF8RVWG7NZ4YR76.png'
    },
    {
      id: 1,
      name: 'Brakes',
      slug: 'brakes',
      icon: 'https://bcdn.aloparca.com/category/icons/10106.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10106.png'
    },
    {
      id: 21,
      name: 'Ignition System',
      slug: 'ignition-system',
      icon: 'https://bcdn.aloparca.com/category/icons/01J7WTWSD87ZD17H31DTT81V3A.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/01J7WTWZBXHB16776VFZQ3H99B.png'
    },
    {
      id: 5,
      name: 'Suspension',
      slug: 'suspension',
      icon: 'https://bcdn.aloparca.com/category/icons/10111.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10111.png'
    },
    {
      id: 2,
      name: 'Clutch',
      slug: 'clutch',
      icon: 'https://bcdn.aloparca.com/category/icons/10150.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10150.png'
    },
    {
      id: 20,
      name: 'Timing Chain & Bearings',
      slug: 'timing-chain-and-bearings',
      icon: 'https://bcdn.aloparca.com/category/icons/01J7WV3AKG15PAD6TK7YWKDWQC.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/01J7WV3B6CNEHGNNA2J5QY9DXP.png'
    },
    {
      id: 4,
      name: 'Fuel System',
      slug: 'fuel-system',
      icon: 'https://bcdn.aloparca.com/category/icons/10354.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10354.png'
    },
    {
      id: 13,
      name: 'Transmission',
      slug: 'transmission',
      icon: 'https://bcdn.aloparca.com/category/icons/10338.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10338.png'
    },
    {
      id: 8,
      name: 'Lighting',
      slug: 'lighting',
      icon: 'https://bcdn.aloparca.com/category/icons/74832.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/01JJ44R9GR4BJMK692YGPNP5W5.png'
    },
    {
      id: 3,
      name: 'Engine',
      slug: 'engine',
      icon: 'https://bcdn.aloparca.com/category/icons/10102.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10102.png'
    },
    {
      id: 6,
      name: 'Steering',
      slug: 'steering',
      icon: 'https://bcdn.aloparca.com/category/icons/10112.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10112.png'
    },
    {
      id: 12,
      name: 'Body Parts',
      slug: 'body-parts',
      icon: 'https://bcdn.aloparca.com/category/icons/10101.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10101.png'
    },
    {
      id: 15,
      name: 'Cooling & Heating',
      slug: 'cooling-and-heating',
      icon: 'https://bcdn.aloparca.com/category/icons/10341.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10341.png'
    },
    {
      id: 7,
      name: 'Electrical',
      slug: 'electrical',
      icon: 'https://bcdn.aloparca.com/category/icons/10110.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10110.png'
    },
    {
      id: 10,
      name: 'Bumper & Parts',
      slug: 'bumper-and-parts',
      icon: 'https://bcdn.aloparca.com/category/icons/10101.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10101.png'
    },
    {
      id: 11,
      name: 'Grille & Panels',
      slug: 'grille-and-panels',
      icon: 'https://bcdn.aloparca.com/category/icons/10101.svg',
      imageUrl: 'https://bcdn.aloparca.com/category/image/10101.png'
    }
  ];

  mainCategories: Category[] = [
    this.categories.find(c => c.name === 'Filters'),
    this.categories.find(c => c.name === 'Brakes'),
    this.categories.find(c => c.name === 'Clutch'),
    this.categories.find(c => c.name === 'Engine'),
    this.categories.find(c => c.name === 'Suspension'),
    this.categories.find(c => c.name === 'Lighting'),
    this.categories.find(c => c.name === 'Cooling & Heating'),
    this.categories.find(c => c.name === 'Electrical'),
    this.categories.find(c => c.name === 'Transmission')
  ].filter((category): category is Category => category !== undefined);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    
    this.authService.getAuthStatus().subscribe(
      status => {
        this.isAuthenticated = status;
        if (status) {
          this.loadUserProfile();
        } else {
          this.userName = '';
        }
      }
    );

    if (this.isAuthenticated) {
      this.loadUserProfile();
    }

    this.cartService.cartItems$.subscribe(
      items => {
        this.cartItemCount = items.length;
      }
    );
  }

  mouseLeave() {
    this.timeout = setTimeout(() => {
      this.isOpen = false;
      this.activeCategory = null;
      this.activeCategoryImage = null;
    }, 300);
  }

  mouseEnter() {
    clearTimeout(this.timeout);
  }

  setActiveCategory(categoryId: number, imageUrl: string) {
    this.activeCategory = categoryId;
    this.activeCategoryImage = imageUrl;
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (profile: any) => {
        if (profile && profile.name) {
          this.userName = profile.name;
        }
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.userName = 'My Account'; // Fallback name
      }
    });
  }

  handleAccountClick(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login-signup']);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    this.authService.logout();
    this.isAuthenticated = false;
    this.userName = '';
    this.router.navigate(['/']);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    this.cartService.toggleCart();
  }
 
  toggleCategories() {
    this.showCategoriesDropdown = !this.showCategoriesDropdown;
  }

  handleSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchTerm }
      });
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/280x80?text=Alopieces+Auto';
  }

  handleImageLoad(event: any): void {
    console.log('Image loaded successfully');
  }

  getAccountDisplayText(): string {
    return this.isAuthenticated ? (this.userName || 'My Account') : 'Login/Sign Up';
  }
}