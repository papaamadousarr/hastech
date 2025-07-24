import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService, SubCategory } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductMainCategory } from '../interfaces/product-category.interface';
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
  subCategories: SubCategory[] = [];
  filteredBrands: any[] = [];
  categories: any[] = [];
  category: any;
  subcategories: any[] = [];
  selectedSubcategory: any;
  products: any[] = [];


  // UI state properties
  selectedMainCategory: string | null = null;
  selectedLetter: string = 'All';
  isLoading: boolean = false;
  errorMessage: string = '';
  expandedCategorySlug: string | null = null;
  showAdvancedFilters = false;

  // Ajout pour la gestion des filtres
  filters = {
    searchTerm: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleEngine: '',
    priceMin: null,
    priceMax: null,
    oemNumber: '',
    inStockOnly: false
  };

  // Méthodes manquantes pour le template
  onSearchTermChange(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.filters.searchTerm = value;
    this.applyFilters();
  }

  onVehicleBrandFilterChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.vehicleBrand = value;
    this.applyFilters();
  }

  onVehicleModelFilterChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.vehicleModel = value;
    this.applyFilters();
  }

  onVehicleEngineFilterChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.vehicleEngine = value;
    this.applyFilters();
  }

  onPriceRangeChange() {
    this.applyFilters();
  }

  onOemNumberChange(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.filters.oemNumber = value;
    this.applyFilters();
  }

  onAvailabilityChange(event: any) {
    const value = (event.target as HTMLInputElement).checked;
    this.filters.inStockOnly = value;
    this.applyFilters();
  }

  applyFilters() {
    // Filtrer les produits selon les critères
    let filteredProducts = [...this.products];

    // Filtre par terme de recherche
    if (this.filters.searchTerm) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.details.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par marque de véhicule
    if (this.filters.vehicleBrand) {
      filteredProducts = filteredProducts.filter(product =>
        product.details.toLowerCase().includes(this.filters.vehicleBrand.toLowerCase())
      );
    }

    // Filtre par modèle de véhicule
    if (this.filters.vehicleModel) {
      filteredProducts = filteredProducts.filter(product =>
        product.details.toLowerCase().includes(this.filters.vehicleModel.toLowerCase())
      );
    }

    // Filtre par moteur de véhicule
    if (this.filters.vehicleEngine) {
      filteredProducts = filteredProducts.filter(product =>
        product.details.toLowerCase().includes(this.filters.vehicleEngine.toLowerCase())
      );
    }

    // Filtre par prix minimum
    if (this.filters.priceMin !== null && this.filters.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price && product.price >= this.filters.priceMin!
      );
    }

    // Filtre par prix maximum
    if (this.filters.priceMax !== null && this.filters.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.price && product.price <= this.filters.priceMax!
      );
    }

    // Filtre par numéro OEM
    if (this.filters.oemNumber) {
      const oemNumber = this.filters.oemNumber.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.code.toLowerCase().includes(oemNumber)
      );
    }

    // Filtre par disponibilité
    if (this.filters.inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Mettre à jour les produits affichés
    this.products = filteredProducts;
  }

  clearFilters() {
    this.filters = {
      searchTerm: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleEngine: '',
      priceMin: null,
      priceMax: null,
      oemNumber: '',
      inStockOnly: false
    };
    // Recharger tous les produits
    this.loadProducts();
  }

  private loadProducts() {
    // Charger tous les produits depuis le service
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Erreur lors du chargement des produits';
      }
    });
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.handleRouteParams();
    
    // Améliorer le chargement des catégories avec gestion d'erreurs
    this.http.get<any[]>('assets/data/categories_en.json').subscribe({
      next: (data) => {
        this.categories = data;
        this.route.params.subscribe(params => {
          const categorySlug = params['id'];
          const subcategorySlug = params['subcategoryId'];
          this.category = this.categories.find(cat => cat.slug === categorySlug);
          this.subcategories = this.category ? this.category.subcategories : [];
          this.selectedSubcategory = this.subcategories.find(sub => sub.slug === subcategorySlug);
          this.expandedCategorySlug = categorySlug;
        });
      },
      error: (error) => {
        console.error('Error loading categories from JSON:', error);
        this.errorMessage = 'Erreur lors du chargement des catégories';
      }
    });

    // Charger les produits depuis l'API
    this.loadProducts();
  }

  private loadInitialData(): void {
    this.loadMainCategories();
    this.loadBrands();
  }

  private handleRouteParams(): void {
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
      const subcategoryId = params['subcategoryId'];
      
      if (categoryId) {
        this.selectedMainCategory = categoryId;
        this.loadSubCategories(categoryId);
        
        // Si une sous-catégorie est spécifiée dans l'URL, la charger
        if (subcategoryId) {
          console.log('Loading subcategory from URL:', subcategoryId);
          this.loadProductsForSubcategory(subcategoryId);
        }
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
        // Ensure categories is an array before mapping
        if (Array.isArray(categories)) {
          this.mainCategories = categories.map(cat => ({
            ...cat,
            icon: '',
            subCategories: [],
            isExpanded: false
          }));
        } else {
          console.warn('Categories response is not an array:', categories);
          this.mainCategories = [];
        }
      });
  }

  loadSubCategories(mainCategoryId: string): void {
    if (!mainCategoryId) return;

    this.isLoading = true;
    this.productService.getSubCategoriesByCategory(mainCategoryId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading subcategories';
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(subCategories => {
        // Ensure subCategories is an array before assignment
        if (Array.isArray(subCategories)) {
          this.subCategories = subCategories;
        } else {
          console.warn('SubCategories response is not an array:', subCategories);
          this.subCategories = [];
        }
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
    if (this.expandedCategorySlug === slug) {
      // Fermer le dropdown
      this.expandedCategorySlug = null;
    } else {
      // Ouvrir le dropdown et charger les sous-catégories
      this.expandedCategorySlug = slug;
      
      // Trouver la catégorie correspondante
      const category = this.categories.find(cat => cat.slug === slug);
      if (category) {
        console.log('Loading subcategories for category:', category.name, 'with slug:', slug);
        
        // Charger les sous-catégories via l'API
        this.isLoading = true;
        this.productService.getSubCategoriesByCategory(slug)
          .pipe(
            catchError(error => {
              console.error('Error loading subcategories for category:', slug, error);
              this.errorMessage = 'Erreur lors du chargement des sous-catégories';
              return of([]);
            }),
            finalize(() => this.isLoading = false)
          )
          .subscribe(subCategories => {
            console.log('Received subcategories for category:', slug, subCategories);
            
            // Mettre à jour les sous-catégories de cette catégorie spécifique
            if (Array.isArray(subCategories)) {
              this.subCategories = subCategories;
            } else {
              console.warn('SubCategories response is not an array:', subCategories);
              this.subCategories = [];
            }
          });
      }
    }
  }

  decrementQty(product: any) {
    if (product.quantity > 1) product.quantity--;
  }

  incrementQty(product: any) {
    product.quantity++;
  }

  get filteredProducts() {
    // Retourner directement les produits chargés depuis l'API
    return this.products;
  }

  // Méthode pour charger les produits d'une sous-catégorie
  loadProductsForSubcategory(subcategoryId: string): void {
    console.log('Loading products for subcategory:', subcategoryId);
    
    this.isLoading = true;
    this.productService.getParts(subcategoryId)
      .pipe(
        catchError(error => {
          console.error('Error loading products for subcategory:', subcategoryId, error);
          this.errorMessage = 'Erreur lors du chargement des produits';
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(products => {
        console.log('Received products for subcategory:', subcategoryId, products);
        
        if (Array.isArray(products)) {
          // Log la structure du premier produit pour debug
          if (products.length > 0) {
            console.log('First product structure:', products[0]);
          }
          this.products = products;
        } else {
          console.warn('Products response is not an array:', products);
          this.products = [];
        }
      });
  }

  // Méthode pour gérer la sélection d'une sous-catégorie
  onSubcategorySelect(subcategory: SubCategory): void {
    console.log('Selected subcategory:', subcategory);
    this.selectedSubcategory = subcategory;
    
    // Charger les produits pour cette sous-catégorie en utilisant le slug
    if (subcategory.slug) {
      this.loadProductsForSubcategory(subcategory.slug);
    } else if (subcategory.id) {
      // Fallback vers l'ID si le slug n'est pas disponible
      this.loadProductsForSubcategory(subcategory.id);
    }
  }
}