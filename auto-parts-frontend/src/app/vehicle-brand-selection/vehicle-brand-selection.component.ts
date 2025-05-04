import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface CarBrand {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-vehicle-brand-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-semibold text-center mb-8">Popular Car Brands Original Spare Parts</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div *ngFor="let brand of carBrands" 
             (click)="onBrandSelect(brand.name)"
             class="brand-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center cursor-pointer">
          <img [src]="brand.logo" 
               [alt]="brand.name" 
               class="w-24 h-24 mx-auto mb-4 object-contain">
          <h3 class="text-lg text-gray-800">{{brand.name}}</h3>
        </div>
      </div>

      <div class="text-center mt-8">
        <button class="px-8 py-3 bg-[#f85a00] hover:bg-[#d94e00] text-white font-medium rounded-md transition-all duration-200">
          View All Car Brands
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
export class VehicleBrandSelectionComponent {
  carBrands: CarBrand[] = [
    { name: 'AUDI', logo: 'assets/images/vehicle_brand/audi.svg' },
    { name: 'BMW', logo: 'assets/images/vehicle_brand/bmw.svg' },
    { name: 'CITROËN', logo: 'assets/images/vehicle_brand/citroen.svg' },
    { name: 'FIAT', logo: 'assets/images/vehicle_brand/fiat.svg' },
    { name: 'FORD', logo: 'assets/images/vehicle_brand/ford.svg' },
    { name: 'HYUNDAI', logo: 'assets/images/vehicle_brand/hyundai.svg' },
    { name: 'MERCEDES-BENZ', logo: 'assets/images/vehicle_brand/mercedes.svg' },
    { name: 'OPEL', logo: 'assets/images/vehicle_brand/opel.svg' },
    { name: 'PEUGEOT', logo: 'assets/images/vehicle_brand/peugeot.svg' },
    { name: 'RENAULT', logo: 'assets/images/vehicle_brand/renault.svg' },
    { name: 'VOLKSWAGEN', logo: 'assets/images/vehicle_brand/volkswagen.svg' }
  ];

  constructor(private router: Router) {}

  onBrandSelect(brandName: string) {
    this.router.navigate(['/vehicle-models', brandName]);
  }
}
