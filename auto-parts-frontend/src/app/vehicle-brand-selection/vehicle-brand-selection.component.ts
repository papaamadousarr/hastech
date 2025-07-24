import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { VehicleBrand } from '../interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicle-brand-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-semibold text-center mb-8">Popüler Otomobil Markaları İçin Orijinal Yedek Parçalar</h2>
      
      <!-- Debug Message -->
      <div class="text-center mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p class="text-yellow-800">DEBUG: Component loaded successfully!</p>
        <p class="text-yellow-800">Brands count: {{carBrands.length}}</p>
        <p class="text-yellow-800">Loading: {{loading}}, Error: {{error}}</p>
      </div>
      
      <!-- Test Button -->
      <div class="text-center mb-4">
        <button (click)="testAPI()" class="px-4 py-2 bg-blue-500 text-white rounded">
          Test API Connection
        </button>
      </div>
      
      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f85a00]"></div>
        <p class="mt-2 text-gray-600">Loading brands...</p>
      </div>

      <div *ngIf="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
        <button (click)="loadBrands()" class="mt-4 px-4 py-2 bg-[#f85a00] text-white rounded">
          Retry
        </button>
      </div>
      
      <div *ngIf="!loading && !error" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div *ngFor="let brand of carBrands" 
             (click)="onBrandSelect(brand)"
             class="brand-card bg-white rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
          <img [src]="brand.imageURL" 
               [alt]="brand.name" 
               class="w-16 h-16 object-contain mb-2">
          <h3 class="text-sm text-gray-800 text-center">{{brand.name}}</h3>
        </div>
      </div>

      <div class="text-center mt-8">
        <button class="px-8 py-3 bg-[#f85a00] hover:bg-[#d94e00] text-white font-medium rounded-md transition-all duration-200" (click)="viewAllBrands()">
          TÜM ARAÇ MARKALARI
        </button>
      </div>
    </div>
  `,
  styles: [`
    .brand-card:hover img {
      transform: scale(1.05);
      transition: transform 0.2s ease-in-out;
    }
  `]
})
export class VehicleBrandSelectionComponent implements OnInit {
  carBrands: VehicleBrand[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadBrands();
  }

  onBrandSelect(brand: VehicleBrand) {
    console.log('Selected brand:', brand);
    this.router.navigate(['/vehicle-models', brand._id]);
  }

  viewAllBrands() {
    this.router.navigate(['/all-car-brands']);
  }

  loadBrands() {
    this.loading = true;
    this.error = null;
    
    this.vehicleService.getVehicleBrands().subscribe({
      next: (brands) => {
        console.log('Loaded brands:', brands);
        this.carBrands = brands.filter(brand => brand.isActive);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
        this.error = 'Failed to load vehicle brands. Please try again.';
        this.loading = false;
        
        // Fallback to static data if API fails
        this.carBrands = [
          {
            _id: 'audi',
            name: 'Audi',
            slug: 'audi',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_audi.svg',
            isActive: true,
            sortOrder: 1,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'bmw',
            name: 'BMW',
            slug: 'bmw',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_bmw.svg',
            isActive: true,
            sortOrder: 2,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'citroen',
            name: 'Citroën',
            slug: 'citroen',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_citroen.svg',
            isActive: true,
            sortOrder: 3,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'fiat',
            name: 'Fiat',
            slug: 'fiat',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_fiat.svg',
            isActive: true,
            sortOrder: 4,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'ford',
            name: 'Ford',
            slug: 'ford',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_ford.svg',
            isActive: true,
            sortOrder: 5,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'hyundai',
            name: 'Hyundai',
            slug: 'hyundai',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_hyundai.svg',
            isActive: true,
            sortOrder: 6,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'mercedes',
            name: 'Mercedes-Benz',
            slug: 'mercedes-benz',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_mercedes-benz.svg',
            isActive: true,
            sortOrder: 7,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'opel',
            name: 'Opel',
            slug: 'opel',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_opel.svg',
            isActive: true,
            sortOrder: 8,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'peugeot',
            name: 'Peugeot',
            slug: 'peugeot',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_peugeot.svg',
            isActive: true,
            sortOrder: 9,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'renault',
            name: 'Renault',
            slug: 'renault',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_renault.svg',
            isActive: true,
            sortOrder: 10,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          },
          {
            _id: 'volkswagen',
            name: 'Volkswagen',
            slug: 'volkswagen',
            imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_volkswagen.svg',
            isActive: true,
            sortOrder: 11,
            createdAt: '2025-06-29T20:25:08.342Z',
            updatedAt: '2025-06-29T20:25:08.342Z'
          }
        ];
        this.loading = false;
      }
    });
  }

  testAPI() {
    console.log('Testing API connection...');
    this.vehicleService.getVehicleBrands().subscribe({
      next: (brands) => {
        alert(`API Test Successful! Found ${brands.length} brands.`);
        console.log('API test successful:', brands);
      },
      error: (err) => {
        alert(`API Test Failed: ${err.message}`);
        console.error('API test failed:', err);
      }
    });
  }
}
