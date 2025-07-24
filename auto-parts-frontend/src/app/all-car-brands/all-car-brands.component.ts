import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { VehicleBrand } from '../interfaces/vehicle.interface';

@Component({
  selector: 'app-all-car-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-car-brands.component.html',
  styleUrls: ['./all-car-brands.component.css']
})
export class AllCarBrandsComponent implements OnInit {
  constructor(
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  allBrands: VehicleBrand[] = [];
  loading: boolean = true;
  error: string | null = null;
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string = 'ALL';

  ngOnInit() {
    this.loadAllBrands();
  }

  loadAllBrands() {
    this.loading = true;
    this.error = null;

    this.vehicleService.getVehicleBrands().subscribe({
      next: (brands) => {
        console.log('Loaded all brands:', brands);
        this.allBrands = brands.filter(brand => brand.isActive);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
        this.error = 'Failed to load vehicle brands. Please try again.';
        this.loading = false;
        
        // Fallback to static data if API fails
        this.allBrands = [
          { _id: 'audi', name: 'AUDI', slug: 'audi', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_audi.svg', isActive: true, sortOrder: 1, createdAt: '', updatedAt: '' },
          { _id: 'bmw', name: 'BMW', slug: 'bmw', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_bmw.svg', isActive: true, sortOrder: 2, createdAt: '', updatedAt: '' },
          { _id: 'mercedes', name: 'MERCEDES-BENZ', slug: 'mercedes-benz', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_mercedes-benz.svg', isActive: true, sortOrder: 3, createdAt: '', updatedAt: '' },
          { _id: 'volkswagen', name: 'VOLKSWAGEN', slug: 'volkswagen', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_volkswagen.svg', isActive: true, sortOrder: 4, createdAt: '', updatedAt: '' },
          { _id: 'ford', name: 'FORD', slug: 'ford', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_ford.svg', isActive: true, sortOrder: 5, createdAt: '', updatedAt: '' },
          { _id: 'toyota', name: 'TOYOTA', slug: 'toyota', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_toyota.svg', isActive: true, sortOrder: 6, createdAt: '', updatedAt: '' },
          { _id: 'honda', name: 'HONDA', slug: 'honda', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_honda.svg', isActive: true, sortOrder: 7, createdAt: '', updatedAt: '' },
          { _id: 'nissan', name: 'NISSAN', slug: 'nissan', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_nissan.svg', isActive: true, sortOrder: 8, createdAt: '', updatedAt: '' },
          { _id: 'hyundai', name: 'HYUNDAI', slug: 'hyundai', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_hyundai.svg', isActive: true, sortOrder: 9, createdAt: '', updatedAt: '' },
          { _id: 'kia', name: 'KIA', slug: 'kia', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_kia.svg', isActive: true, sortOrder: 10, createdAt: '', updatedAt: '' },
          { _id: 'peugeot', name: 'PEUGEOT', slug: 'peugeot', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_peugeot.svg', isActive: true, sortOrder: 11, createdAt: '', updatedAt: '' },
          { _id: 'renault', name: 'RENAULT', slug: 'renault', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_renault.svg', isActive: true, sortOrder: 12, createdAt: '', updatedAt: '' },
          { _id: 'citroen', name: 'CITROËN', slug: 'citroen', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_citroen.svg', isActive: true, sortOrder: 13, createdAt: '', updatedAt: '' },
          { _id: 'opel', name: 'OPEL', slug: 'opel', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_opel.svg', isActive: true, sortOrder: 14, createdAt: '', updatedAt: '' },
          { _id: 'skoda', name: 'SKODA', slug: 'skoda', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_skoda.svg', isActive: true, sortOrder: 15, createdAt: '', updatedAt: '' },
          { _id: 'seat', name: 'SEAT', slug: 'seat', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_seat.svg', isActive: true, sortOrder: 16, createdAt: '', updatedAt: '' },
          { _id: 'volvo', name: 'VOLVO', slug: 'volvo', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_volvo.svg', isActive: true, sortOrder: 17, createdAt: '', updatedAt: '' },
          { _id: 'porsche', name: 'PORSCHE', slug: 'porsche', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_porsche.svg', isActive: true, sortOrder: 18, createdAt: '', updatedAt: '' },
          { _id: 'mini', name: 'MINI', slug: 'mini', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_mini.svg', isActive: true, sortOrder: 19, createdAt: '', updatedAt: '' },
          { _id: 'land-rover', name: 'LAND ROVER', slug: 'land-rover', imageURL: 'https://bcdn.aloparca.com/car-maker-images/marka_landrover.svg', isActive: true, sortOrder: 20, createdAt: '', updatedAt: '' }
        ];
        this.loading = false;
      }
    });
  }

  get filteredBrands() {
    if (this.selectedLetter === 'ALL') return this.allBrands;
    return this.allBrands.filter(brand => brand.name.startsWith(this.selectedLetter));
  }

  selectLetter(letter: string) {
    this.selectedLetter = letter;
  }

  goToBrandModels(brand: VehicleBrand) {
    console.log('Selected brand:', brand);
    this.router.navigate(['/vehicle-models', brand._id]);
  }
}
