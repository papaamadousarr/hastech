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
import { HttpClient } from '@angular/common/http';
import { PRODUCTS } from '../../assets/data/products';

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
  categories: any[] = [];
  category: any;
  subcategories: any[] = [];
  selectedSubcategory: any;
  products: any[] = PRODUCTS;


  // UI state properties
  selectedMainCategory: string | null = null;
  selectedLetter: string = 'All';
  isLoading: boolean = false;
  errorMessage: string = '';
  expandedCategorySlug: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.handleRouteParams();
    this.http.get<any[]>('assets/data/categories_en.json').subscribe(data => {
      this.categories = data;
      this.route.params.subscribe(params => {
        const categorySlug = params['id'];
        const subcategorySlug = params['subcategoryId'];
        this.category = this.categories.find(cat => cat.slug === categorySlug);
        this.subcategories = this.category ? this.category.subcategories : [];
        this.selectedSubcategory = this.subcategories.find(sub => sub.slug === subcategorySlug);
        this.expandedCategorySlug = categorySlug;
  
      });
    });

    this.products = [
      {
        name: 'Tie Rod',
        subcategory: 'tie-rod',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/89/074944aaa984562d30df9d737a78e06046eb434c.webp?width=366',
        details: 'Tie Rod BMW E36 91-99',
        code: 'DELPHI-TA1455',
        mountSide: 'Front axle right; Front axle left',
        length: 226,
        width: 43,
        height: 43,
        price: 17000,
        inStock: true,
        quantity: 1
      },
      {
        name: 'Tie Rod',
        subcategory: 'tie-rod',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/89/4a66323800755d0aefbc150262dc38aa7469fe9f.webp?width=366',
        details: 'Tie Rod OPEL MER.A 03-10',
        code: 'DELPHI-TA1904',
        mountSide: 'Front axle right; Front axle left',
        length: 334,
        width: 37,
        height: 37,
        price: 11000,
        inStock: true,
        quantity: 1
      },
      {
        name: 'Tie Rod',
        subcategory: 'tie-rod',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/89/9a94307ee8371848ad3f85d65f02f9eaffab20a7.webp?width=366',
        details: 'ROT MİLİ M.BENZ VITO 108 110 112 113CDİ 98-03',
        code: 'DELPHI-TA1765',
        mountSide: 'Front axle right; Front axle left',
        length: 362,
        width: 40,
        height: 40,
        price: 20000,
        inStock: false,
        quantity: 0
      },
      {
        name: 'Tie Rod',
        subcategory: 'tie-rod',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/89/8efb5f76a0dd97931d09ffbcb5617dba3932319c.webp?width=366',
        details: 'ROT MİLİ OPEL CORSA C 00-',
        code: 'DELPHI-TA2029',
        mountSide: 'Front axle right; Front axle left',
        length: 320,
        width: 36,
        height: 36,
        price: 15000,
        inStock: true,
        quantity: 1
      },
      // Air Filter products
      {
        name: 'Air Filter',
        subcategory: 'air-filter',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/21/6aab04d62b0cd8220415d245c540604d1dc86566.webp?width=366',
        details: 'HYUNDAI ACCENT Air Filter',
        code: 'BOSCH-1987435602',
        length: 224,
        width: 201,
        height: 28,
        price: 10000,
        inStock: false,
        quantity: 1
      },
      {
        name: 'Air Filter',
        subcategory: 'air-filter',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/256/1e1d2b50627b6425242ba55150f78ec1b8ed4e67.webp?width=366',
        details: 'BSG Air Filter',
        code: 'BSG-40135022',
        length: 256,
        width: 146,
        height: 54,
        price: 10000,
        inStock: false,
        quantity: 1
      },
      {
        name: 'Air Filter',
        subcategory: 'air-filter',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/256/f03d1a7fd4a42be4d4153c2ecf39b222cbbd61cf.webp?width=366',
        details: 'BSG Air Filter',
        code: 'BSG-40135007',
        length: 247,
        width: 160,
        height: 38,
        price: 8000,
        inStock: true,
        quantity: 1
      },
      // Oil Filter products
      {
        name: 'Oil Filter',
        subcategory: 'oil-filter',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/21/014b22919ae63557f220937a563fd8e6d5bc7d56.webp?width=366',
        details: 'Valeo Oil Filter (Short Type) - HYUNDAI H100',
        code: 'VALEO-586090',
        height: 110,
        weight: 0.28,
        thread: 'M26x1.5',
        outerDiameter: 94,
        price: 15000,
        inStock: false,
        quantity: 1
      },
      {
        name: 'Oil Filter',
        subcategory: 'oil-filter',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/21/014b22919ae63557f220937a563fd8e6d5bc7d56.webp?width=366',
        details: 'Valeo Oil Filter - Renault/Dacia',
        code: 'VALEO-586144',
        height: 79,
        weight: 0.28,
        thread: 'M20x1.5',
        outerDiameter: 75,
        price: 15000,
        inStock: true,
        quantity: 1
      },
      // Headlight products
      {
        name: 'Headlight',
        subcategory: 'headlight',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/2/6cb79d88e0e0864b59aa1be60aa5b1e11db63851.webp?width=366',
        details: 'HEADLIGHT GOLF 98>SİSSİZ R',
        code: 'HELLA-1EL007700081',
        voltage: 12,
        mountSide: 'Right',
        lampType: 'H7/H1; PY21W; W5W',
        lampDesign: 'FF; Halogen',
        price: 175000,
        inStock: true,
        quantity: 1
      },
      {
        name: 'Headlight',
        subcategory: 'headlight',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/2/1fdf06831ee8e71b4eb245b54aaf32d435ee6b71.webp?width=366',
        details: 'L HEADLIGHT HALOJEN SKODA OCTAVIA II',
        code: 'HELLA-1EL247052251',
        voltage: 12,
        mountSide: 'Left',
        lampType: 'H7/H1; PY21W; W5W',
        lampDesign: 'DE; FF; Halogen',
        price: 150000,
        inStock: false,
        quantity: 0
      }
    ];
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

 

  addToCart(product: any) {
    alert(`Added ${product.name} to cart!`);
  }

  isCategoryExpanded(slug: string): boolean {
    return this.expandedCategorySlug === slug;
  }

  toggleCategoryDropdown(slug: string): void {
    this.expandedCategorySlug = this.expandedCategorySlug === slug ? null : slug;
  }

  decrementQty(product: any) {
    if (product.quantity > 1) product.quantity--;
  }

  incrementQty(product: any) {
    product.quantity++;
  }

  get filteredProducts() {
    if (!this.selectedSubcategory) return [];
    // Match by slug
    return this.products.filter(product =>
      product.subcategory &&
      product.subcategory.toLowerCase() === this.selectedSubcategory.slug.toLowerCase()
    );
  }
}