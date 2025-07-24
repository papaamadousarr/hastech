import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, FilteredProductsResponse, Category, SubCategory, Part } from '../services/product.service';
import { VehicleDetails } from '../interfaces/product-category.interface';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';

interface VehicleInfo {
  brand: string;
  model: string;
  engine: string;
  year?: string;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  vehicleInfo: VehicleInfo | null = null;
  selectedCategory: string = '';
  searchQuery: string = '';
  error: string | null = null;
  loading = false;
  vehicleImage: string = '';
  
  // Données dynamiques de la base
  categories: Category[] = [];
  selectedSubcategory: SubCategory | null = null;
  products: any[] = [];
  errorMessage = '';
  searchParams: any;
  subcategories: SubCategory[] = [];

  // États pour les modals
  isVehicleModalOpen = false;
  isCarSelectorOpen = false;

  // Filtres avancés
  advancedFilters = {
    priceRange: { min: 0, max: 10000 },
    brands: [] as string[],
    categories: [] as string[],
    inStockOnly: false,
    sortBy: 'relevance' as 'relevance' | 'price' | 'name' | 'newest',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 0;

  // Suggestions et autocomplétion
  searchSuggestions: string[] = [];
  showSuggestions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['brand'] && params['model']) {
        this.vehicleInfo = {
          brand: params['brand'],
          model: params['model'],
          engine: params['engine'] || ''
        };
        // Reset vehicle image when parameters change
        this.vehicleImage = '';
        this.loadCategories();
        this.loadPartsForVehicle();
      }
      const categoryId = params['category'] || params['id'];
      if (categoryId) {
        this.productService.getSubCategoriesByCategory(categoryId).subscribe((subs: any) => {
          this.subcategories = subs;
        });
      }

      // Appliquer les filtres depuis l'URL
      this.applyFiltersFromUrl(params);
    });
  }

  private applyFiltersFromUrl(params: any): void {
    if (params['minPrice']) this.advancedFilters.priceRange.min = Number(params['minPrice']);
    if (params['maxPrice']) this.advancedFilters.priceRange.max = Number(params['maxPrice']);
    if (params['brands']) this.advancedFilters.brands = params['brands'].split(',');
    if (params['categories']) this.advancedFilters.categories = params['categories'].split(',');
    if (params['inStock']) this.advancedFilters.inStockOnly = params['inStock'] === 'true';
    if (params['sortBy']) this.advancedFilters.sortBy = params['sortBy'];
    if (params['sortOrder']) this.advancedFilters.sortOrder = params['sortOrder'];
    if (params['page']) this.currentPage = Number(params['page']);
  }

  // Méthodes de filtrage avancé
  onPriceRangeChange(): void {
    this.applyAdvancedFilters();
  }

  onBrandFilterChange(brand: string, checked: boolean): void {
    if (checked) {
      this.advancedFilters.brands.push(brand);
    } else {
      this.advancedFilters.brands = this.advancedFilters.brands.filter(b => b !== brand);
    }
    this.applyAdvancedFilters();
  }

  onCategoryFilterChange(category: string, checked: boolean): void {
    if (checked) {
      this.advancedFilters.categories.push(category);
    } else {
      this.advancedFilters.categories = this.advancedFilters.categories.filter(c => c !== category);
    }
    this.applyAdvancedFilters();
  }

  onSortChange(sortBy: string): void {
    this.advancedFilters.sortBy = sortBy as any;
    this.applyAdvancedFilters();
  }

  onSortOrderChange(sortOrder: string): void {
    this.advancedFilters.sortOrder = sortOrder as any;
    this.applyAdvancedFilters();
  }

  onStockFilterChange(checked: boolean): void {
    this.advancedFilters.inStockOnly = checked;
    this.applyAdvancedFilters();
  }

  private applyAdvancedFilters(): void {
    let filteredProducts = [...this.products];

    // Filtre par prix
    filteredProducts = filteredProducts.filter(product => 
      product.price >= this.advancedFilters.priceRange.min && 
      product.price <= this.advancedFilters.priceRange.max
    );

    // Filtre par marques
    if (this.advancedFilters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        this.advancedFilters.brands.includes(product.brand)
      );
    }

    // Filtre par catégories
    if (this.advancedFilters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        this.advancedFilters.categories.includes(product.category)
      );
    }

    // Filtre par disponibilité
    if (this.advancedFilters.inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Tri
    this.sortProducts(filteredProducts);

    this.products = filteredProducts;
    this.updatePagination();
    this.updateUrlWithFilters();
  }

  private sortProducts(products: any[]): void {
    switch (this.advancedFilters.sortBy) {
      case 'price':
        products.sort((a, b) => {
          const comparison = (a.price || 0) - (b.price || 0);
          return this.advancedFilters.sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'name':
        products.sort((a, b) => {
          const comparison = (a.name || a.productName || '').localeCompare(b.name || b.productName || '');
          return this.advancedFilters.sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'newest':
        products.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const comparison = bDate - aDate;
          return this.advancedFilters.sortOrder === 'asc' ? -comparison : comparison;
        });
        break;
      default:
        // Pertinence - garder l'ordre original
        break;
    }
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  private updateUrlWithFilters(): void {
    const params: any = {
      brand: this.vehicleInfo?.brand,
      model: this.vehicleInfo?.model,
      engine: this.vehicleInfo?.engine
    };

    if (this.advancedFilters.priceRange.min > 0) params.minPrice = this.advancedFilters.priceRange.min;
    if (this.advancedFilters.priceRange.max < 10000) params.maxPrice = this.advancedFilters.priceRange.max;
    if (this.advancedFilters.brands.length > 0) params.brands = this.advancedFilters.brands.join(',');
    if (this.advancedFilters.categories.length > 0) params.categories = this.advancedFilters.categories.join(',');
    if (this.advancedFilters.inStockOnly) params.inStock = 'true';
    if (this.advancedFilters.sortBy !== 'relevance') params.sortBy = this.advancedFilters.sortBy;
    if (this.advancedFilters.sortOrder !== 'asc') params.sortOrder = this.advancedFilters.sortOrder;
    if (this.currentPage > 1) params.page = this.currentPage;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  // Pagination
  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrlWithFilters();
  }

  // Recherche avec suggestions
  onSearchInput(event: any): void {
    const query = event.target.value;
    if (query.length >= 2) {
      this.loadSearchSuggestions(query);
    } else {
      this.searchSuggestions = [];
      this.showSuggestions = false;
    }
  }

  private loadSearchSuggestions(query: string): void {
    // Simuler des suggestions basées sur les produits existants
    const suggestions = this.products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.code.toLowerCase().includes(query.toLowerCase())
      )
      .map(product => product.name)
      .slice(0, 5);

    this.searchSuggestions = [...new Set(suggestions)];
    this.showSuggestions = this.searchSuggestions.length > 0;
  }

  onSuggestionClick(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearchParts(new Event('submit'));
  }

  // Actions rapides
  quickAddToCart(product: any): void {
    // Implémenter l'ajout rapide au panier
    console.log('Quick add to cart:', product);
  }

  quickAddToFavorites(product: any): void {
    // Implémenter l'ajout rapide aux favoris
    console.log('Quick add to favorites:', product);
  }

  // Utilitaires
  getAvailableBrands(): string[] {
    return [...new Set(this.products.map(p => p.brand))].sort();
  }

  getAvailableCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))].sort();
  }

  getPriceRange(): { min: number; max: number } {
    if (this.products.length === 0) return { min: 0, max: 10000 };
    
    const prices = this.products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  loadCategories() {
    this.loading = true;
    this.error = null;

    this.productService.getAllCategories()
      .pipe(
        catchError(error => {
          console.error('Error loading categories:', error);
          this.error = 'Erreur lors du chargement des catégories: ' + (error.message || error);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (categories) => {
          // Ensure categories is an array before mapping
          if (Array.isArray(categories)) {
            // Correction : chaque catégorie a un id unique et un tableau vide pour subCategories
            this.categories = categories.map((cat, idx) => ({
              ...cat,
              id: cat.id || (cat as any)._id || `cat-${idx}`,
              subCategories: [] // Initialiser avec un tableau vide
            }));

            console.log('Loaded categories:', this.categories);

            // Charger toutes les sous-catégories en parallèle
            this.loadAllSubcategories();
          } else {
            console.warn('Categories response is not an array in search-results:', categories);
            this.categories = [];
          }
        }
      });
  }

  private loadAllSubcategories() {
    const validCategories = this.categories.filter(cat => cat.id);
    
    if (validCategories.length === 0) {
      console.warn('No valid categories found');
      return;
    }

    console.log('Loading subcategories for categories:', validCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

    // Créer un tableau d'observables pour charger toutes les sous-catégories en parallèle
    // Utiliser le slug au lieu de l'id pour correspondre à l'API backend
    const subcategoryObservables = validCategories.map(category => 
      this.productService.getSubCategoriesByCategory(category.slug).pipe(
        catchError(error => {
          console.error(`Error loading subcategories for ${category.name}:`, error);
          return of([]);
        })
      )
    );

    // Charger toutes les sous-catégories en parallèle
    forkJoin(subcategoryObservables).subscribe({
      next: (subcategoriesArrays) => {
        console.log('Received subcategories arrays:', subcategoriesArrays);
        
        // Assigner les sous-catégories à chaque catégorie
        validCategories.forEach((category, index) => {
          const subcategories = subcategoriesArrays[index];
          category.subCategories = subcategories || [];
          console.log(`Assigned ${subcategories?.length || 0} subcategories to category ${category.name}:`, subcategories);
        });

        // Mettre à jour la propriété globale subcategories avec toutes les sous-catégories
        this.subcategories = subcategoriesArrays.flat();
        console.log('Updated global subcategories:', this.subcategories);
      },
      error: (error) => {
        console.error('Error loading subcategories in parallel:', error);
      }
    });
  }

  private loadPartsForVehicle() {
    if (!this.vehicleInfo) return;

      this.loading = true;
    this.error = null;

    this.productService.getProductsByVehicle(
      this.vehicleInfo.brand,
      this.vehicleInfo.model,
      this.vehicleInfo.engine
    )
        .pipe(
          catchError(error => {
        console.error('Error loading parts:', error);
        this.error = 'Error loading parts: ' + (error.message || error);
        return of({ products: [], total: 0, filters: {} });
          }),
      finalize(() => {
        this.loading = false;
      })
        )
    .subscribe({
      next: (response) => {
        this.products = response.products;
      }
        });
  }

  onCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.loadSubcategories(categoryId);
  }

  private loadSubcategories(categoryId: string) {
    console.log('Loading subcategories for category ID:', categoryId);
    
    // Trouver la catégorie par son ID
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      console.warn('Category not found for ID:', categoryId);
      return;
    }
    
    // Utiliser le slug de la catégorie au lieu de l'ID
    console.log('Using category slug for API call:', category.slug);
    this.productService.getSubCategoriesByCategory(category.slug)
      .pipe(
        catchError(error => {
          console.error('Error loading subcategories:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (subcategories) => {
          console.log('Received subcategories for category', category.name, ':', subcategories);
          
          // Mettre à jour la catégorie avec ses sous-catégories
          category.subCategories = subcategories || [];
          console.log(`Updated category ${category.name} with ${subcategories?.length || 0} subcategories`);
          
          // Mettre à jour aussi la propriété globale
          this.subcategories = subcategories || [];
        }
      });
  }

  getVehicleImage(): string {
    if (!this.vehicleInfo?.brand || !this.vehicleInfo?.model) {
        return 'https://bcdn.aloparca.com/model_series_cars_photo/10266.jpg?width=192';
    }

    // If we already have the image, return it
    if (this.vehicleImage) {
        return this.vehicleImage;
    }

    // Only make the API call once and store the result
    this.productService.getModelImage(this.vehicleInfo.brand, this.vehicleInfo.model)
        .pipe(
            catchError(error => {
                console.error('Error loading vehicle image:', error);
                return of('https://bcdn.aloparca.com/model_series_cars_photo/10266.jpg?width=192');
            })
        )
        .subscribe({
            next: (imageUrl) => {
                this.vehicleImage = imageUrl || 'https://bcdn.aloparca.com/model_series_cars_photo/10266.jpg?width=192';
            }
        });

    return 'https://bcdn.aloparca.com/model_series_cars_photo/10266.jpg?width=192';
  }

  onSubcategorySelect(categoryId: string, subcategoryId: string) {
    this.productService.getParts(subcategoryId)
      .pipe(
        catchError(error => {
          console.error('Error loading parts:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (parts) => {
          // Ici vous pouvez naviguer vers une page de produits ou afficher les pièces
      }
    });
  }

  onSearchParts(event: Event) {
    event.preventDefault();
    if (!this.searchQuery.trim()) return;

    // Logique de recherche
  }

  changeVehicle() {
    this.router.navigate(['/vehicle-search']);
  }

  showVehicleDetails() {
    this.isVehicleModalOpen = true;
  }

  closeVehicleModal() {
    this.isVehicleModalOpen = false;
  }

  openCarSelector() {
    this.isCarSelectorOpen = true;
  }

  closeCarSelector() {
    this.isCarSelectorOpen = false;
  }

  getBrandDisplayName(brandId: string): string {
    // Logique pour afficher le nom de la marque
    return brandId;
  }

  getModelDisplayName(modelId: string): string {
    // Logique pour afficher le nom du modèle
    return modelId;
  }

  getEngineDisplayName(engineId: string): string {
    // Logique pour afficher le nom du moteur
    return engineId;
  }

  onCategoryClick(categoryId: string) {
    // Navigation vers la page de catégorie
    this.router.navigate(['/category', categoryId], {
      queryParams: {
        brand: this.vehicleInfo?.brand,
        model: this.vehicleInfo?.model,
        engine: this.vehicleInfo?.engine
      }
    });
  }

  onSubcategoryClick(categoryId: string, subcategoryId: string) {
    // Navigation vers la page de sous-catégorie
    this.router.navigate(['/category', categoryId, subcategoryId], {
      queryParams: {
        brand: this.vehicleInfo?.brand,
        model: this.vehicleInfo?.model,
        engine: this.vehicleInfo?.engine
      }
    });
  }

  // Méthode de débogage pour vérifier les sous-catégories
  debugSubcategories(category: any): void {
    console.log(`Debug subcategories for category ${category.name}:`, category.subCategories);
  }

  // Méthode pour obtenir le nombre de sous-catégories d'une catégorie
  getSubcategoryCount(category: any): number {
    return category.subCategories ? category.subCategories.length : 0;
  }

  // Méthode pour vérifier si une catégorie a des sous-catégories
  hasSubcategories(category: any): boolean {
    return category.subCategories && category.subCategories.length > 0;
  }

  // Méthode trackBy pour optimiser le rendu des sous-catégories
  trackBySubcategory(index: number, subcategory: any): string {
    return subcategory.id || index.toString();
  }
}