// vehicle-search.component.ts
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, VehicleModel, Engine } from '../services/product.service';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  imageURL: string;
  isActive: boolean;
}

interface Model {
  _id: string;
  name: string;
  brandId: string;
  slug: string;
  imageURL?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleEngine {
  id: string;
  name: string;
  power: string;
  variantId?: string;
}

@Component({
  selector: 'app-vehicle-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.css']
})
export class VehicleSearchComponent implements OnInit, OnChanges {
  @Output() searchComplete = new EventEmitter<any>();
  @Input() brand: string = '';

  selectedBrand: string = '';
  selectedModel: string = '';
  selectedEngine: string = '';

  brands: Brand[] = [];
  models: Model[] = [];
  engines: VehicleEngine[] = [];

  loading: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private http: HttpClient
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['brand'] && changes['brand'].currentValue && !this.loading) {
      this.selectedBrand = changes['brand'].currentValue;
      // Attendre que les marques soient chargées avant de sélectionner
      if (this.brands.length > 0) {
        this.onBrandSelect();
      }
    }
  }

  ngOnInit() {
    
    // Test API connection first
    this.testAPIConnection();
    
    // Charger les marques après le test de connexion
    this.loadBrands();
    
    // Ne pas déclencher onBrandSelect ici pour éviter les appels en cascade
    // Cela sera géré par ngOnChanges si une marque est fournie
  }

  testAPIConnection() {
    this.http.get('http://localhost:3000/api/vehicle_brands')
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
          this.error = 'Backend API is not accessible. Please check if the backend is running.';
        }
    });
  }

  loadBrands() {
    this.loading = true;
    this.error = null;

    this.productService.getAllVehicleBrands()
      .pipe(
        catchError(error => {
          this.error = 'Error loading brands: ' + (error.message || error);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          
          // Si une marque était présélectionnée, la sélectionner maintenant
          if (this.brand && this.brands.length > 0) {
            this.selectedBrand = this.brand;
            this.onBrandSelect();
          }
        })
      )
      .subscribe({
        next: (brands) => {
          this.brands = brands;
        },
        error: (error) => {
          this.error = 'Error loading brands: ' + (error.message || error);
        }
      });
  }

  onBrandSelect() {
    this.selectedModel = '';
    this.selectedEngine = '';
    this.engines = [];

    if (this.selectedBrand) {
      this.loadModels();
    } else {
      this.models = [];
    }
  }

  loadModels() {
    this.loading = true;
    this.error = null;

    // Utiliser le nom de la marque au lieu de l'ID
    this.productService.getModelsForBrand(this.selectedBrand)
      .pipe(
        catchError(error => {
          this.error = 'Error loading models: ' + (error.message || error);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (models) => {
          this.models = models;
        },
        error: (error) => {
          this.error = 'Error loading models: ' + (error.message || error);
        }
      });
  }

  onModelSelect() {
    this.selectedEngine = '';

    if (this.selectedModel) {
      this.loadEngines();
    } else {
      this.engines = [];
    }
  }

  loadEngines() {
    this.loading = true;
    this.error = null;

    // Utiliser le nom du modèle au lieu de l'ID
    this.productService.getEnginesForModel(this.selectedBrand, this.selectedModel)
      .pipe(
        catchError(error => {
          this.error = 'Error loading engines: ' + (error.message || error);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (engines) => {
          this.engines = engines;
        },
        error: (error) => {
          this.error = 'Error loading engines: ' + (error.message || error);
    }
      });
  }

  onSearch() {
    if (this.selectedBrand && this.selectedModel && this.selectedEngine) {
      this.router.navigate(['/search-results'], {
        queryParams: {
          brand: this.selectedBrand,
          model: this.selectedModel,
          engine: this.selectedEngine
        }
      });
    }
  }
}