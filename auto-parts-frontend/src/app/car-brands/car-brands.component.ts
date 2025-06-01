import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CarBrand {
  name: string;
  logo: string;
  code: string;
}

@Component({
  selector: 'app-car-brands',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold text-center mb-8">Popular Car Brands</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div *ngFor="let brand of carBrands" 
             (click)="navigateToBrand(brand.code)"
             class="bg-white rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
          <img [src]="brand.logo" [alt]="brand.name" class="h-16 object-contain mb-2">
          <span class="text-gray-800 font-medium">{{brand.name}}</span>
        </div>
      </div>

      <div class="text-center mt-8">
        <button class="bg-[#f85a00] text-white px-6 py-2 rounded-lg hover:bg-[#d94e00] transition-colors">
          VIEW ALL BRANDS
        </button>
      </div>
    </div>
  `
})
export class CarBrandsComponent {
  carBrands: CarBrand[] = [
    {
      name: 'AUDI',
      logo: 'assets/vehicle_brand/audi.svg',
      code: 'audi'

    },
    {
      name: 'BMW',
      logo: 'assets/vehicle_brand/bmw.svg',
      code: 'bmw'
    },

    {
      name: 'CITROËN',
      logo: 'assets/vehicle_brand/citroen.svg',
      code: 'citroen'
    },

    {
      name: 'FIAT',
      logo: 'assets/vehicle_brand/fiat.svg',
      code: 'fiat'
    },

    {
      name: 'FORD',
      logo: 'assets/vehicle_brand/ford.svg',
      code: 'ford'
    },
   { name: 'HONDA',
      logo: 'assets/vehicle_brand/honda.svg',
      code: 'honda'
    },
    {
      name: 'HYUNDAI',
      logo: 'assets/vehicle_brand/hyundai.svg',
      code: 'hyundai'
    },

    {
      name: 'MERCEDES-BENZ',
      logo: 'assets/vehicle_brand/mercedes.svg',
      code: 'mercedes'
    },

    {
      name: 'OPEL',
      logo: 'assets/vehicle_brand/opel.svg',
      code: 'opel'
    },

    {
      name: 'PEUGEOT',
      logo: 'assets/vehicle_brand/peugeot.svg',
      code: 'peugeot'
    },

    {
      name: 'RENAULT',
      logo: 'assets/vehicle_brand/renault.svg',
      code: 'renault'
    },

    {
      name: 'VOLKSWAGEN',
      logo: 'assets/vehicle_brand/volkswagen.svg',
      code: 'volkswagen'
    },

    {
      name: 'TOYOTA',
      logo: 'assets/vehicle_brand/toyota.svg',
      code: 'toyota'
    },
    {
      name: 'PORSCHE',
      logo: 'assets/vehicle_brand/porsche.svg',
      code: 'porsche'
    },
    {
      name: 'KIA',
      logo: 'assets/vehicle_brand/kia.svg',
      code: 'kia'
    } 


  ];

  constructor(private router: Router) {}


  navigateToBrand(brandCode: string) {
    this.router.navigate(['/vehicle-selector'], { queryParams: { brand: brandCode } });
  }
}