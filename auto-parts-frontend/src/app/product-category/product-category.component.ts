import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductMainCategory, ProductSubCategory } from '../interfaces/product-category.interface';
import { VehicleSearchComponent } from '../vehicle-search/vehicle-search.component';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    VehicleSearchComponent
  ]
})
export class ProductCategoryComponent implements OnInit {
  // Vehicle selection properties
  selectedVehicleBrand: string = '';
  selectedYear: string = '';
  selectedModel: string = '';
  selectedBrand: string = '';
  selectedEngine: string = '';
  
  // Data arrays
  vehicleDetails: any[] = [];
  models: any[] = [];
  engines: any[] = [];
  mainCategories: ProductMainCategory[] = [];
  subCategories: ProductSubCategory[] = [];
  filteredBrands: any[] = [];

  // UI state properties
  selectedMainCategory: string | null = null;
  selectedLetter: string = 'All';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.handleRouteParams();
  }

  private loadInitialData(): void {
    this.loadMainCategories();
    this.loadBrands();
  }

  private handleRouteParams(): void {
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
      if (categoryId) {
        this.selectedMainCategory = categoryId;
        this.loadSubCategories(categoryId);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.selectedBrand = params['brand'];
        this.loadModels(this.selectedBrand);
      }
      if (params['model']) {
        this.selectedModel = params['model'];
        this.loadEngines(this.selectedBrand, params['model']);
      }
      if (params['engine']) {
        this.selectedEngine = params['engine'];
      }
    });
  }

  private loadMainCategories(): void {
    this.isLoading = true;
    this.productService.getMainCategories()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading categories';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(categories => {
        this.mainCategories = categories.map(cat => ({
          ...cat,
          icon: '',
          subCategories: [],
          isExpanded: false
        }));
      });
  }

  loadSubCategories(mainCategoryId: string): void {
    if (!mainCategoryId) return;

    this.isLoading = true;
    this.productService.getSubCategories(mainCategoryId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading subcategories';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(subCategories => {
        this.subCategories = subCategories;
      });
  }

  private loadBrands() {
    this.isLoading = true;
    this.productService.getAllVehicleBrands()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading brands';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(brands => {
        this.filteredBrands = brands;
      });
  }

  private loadModels(brand: string) {
    this.isLoading = true;
    this.productService.getModelsForBrand(brand)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading models';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(models => {
        this.models = models;
      });
  }

  private loadEngines(brand: string, model: string) {
    this.isLoading = true;
    this.productService.getEnginesForModel(brand, model)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading engines';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(engines => {
        this.engines = engines;
      });
  }

  onVehicleBrandSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedVehicleBrand = value;
    // Load models when brand is selected
    this.productService.getModelsForBrand(value)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading models';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(models => {
        this.models = models;
        this.selectedModel = '';
        this.selectedEngine = '';
      });
  }

  onYearSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYear = value;
  }

  getAvailableYears(): string[] {
    return ['2020', '2021', '2022', '2023', '2024'];
  }

  getAvailableModels(): string[] {
    if (!this.models || this.models.length === 0) {
      return [];
    }
    return this.models.map(model => model.name || model);
  }

  onSearchParts() {
    if (this.selectedVehicleBrand && this.selectedModel) {
      this.router.navigate(['/search'], {
        queryParams: {
          brand: this.selectedVehicleBrand,
          model: this.selectedModel,
          year: this.selectedYear
        }
      });
    }
  }

  searchCategories(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    // Implement category search logic here
  }

  toggleSubCategory(subCategory: any) {
    subCategory.isExpanded = !subCategory.isExpanded;
  }

  onLetterSelect(letter: string) {
    this.selectedLetter = letter;
    // Implement brand filtering by letter
  }

  onModelSelect(event: Event) {
    const model = (event.target as HTMLSelectElement).value;
    if (this.selectedBrand && model) {
      this.selectedModel = model;
      this.selectedEngine = '';
      this.loadEngines(this.selectedBrand, model);
    }
  }
}