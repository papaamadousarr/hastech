import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService, SearchFilters, SearchResult } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-global-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './global-search-results.component.html',
  styleUrl: './global-search-results.component.css'
})
export class GlobalSearchResultsComponent implements OnInit, OnDestroy {
  searchResults: SearchResult | null = null;
  isLoading = false;
  searchQuery = '';
  filterForm: FormGroup;
  
  // Pagination
  currentPage = 1;
  totalPages = 0;
  itemsPerPage = 20;

  // Filtres
  availableBrands: string[] = [];
  availableCategories: string[] = [];
  priceRange = { min: 0, max: 1000 };

  // UI state
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';
  sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'newest', label: 'Plus récents' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      brand: [''],
      minPrice: [null],
      maxPrice: [null],
      inStock: [false],
      sortBy: ['relevance'],
      sortOrder: ['asc']
    });
  }

  ngOnInit(): void {
    // Écouter les paramètres d'URL
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.searchQuery = params['q'] || '';
        this.currentPage = parseInt(params['page']) || 1;
        
        // Appliquer les filtres depuis l'URL
        this.applyFiltersFromUrl(params);
        
        if (this.searchQuery) {
          this.performSearch();
        }
      });

    // Écouter les changements de filtres
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.performSearch();
      });

    // Écouter les résultats de recherche du service
    this.searchService.searchResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
        this.updatePagination();
        this.extractFiltersData();
      });

    this.searchService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyFiltersFromUrl(params: any): void {
    this.filterForm.patchValue({
      category: params['category'] || '',
      brand: params['brand'] || '',
      minPrice: params['minPrice'] ? parseFloat(params['minPrice']) : null,
      maxPrice: params['maxPrice'] ? parseFloat(params['maxPrice']) : null,
      inStock: params['inStock'] === 'true',
      sortBy: params['sortBy'] || 'relevance',
      sortOrder: params['sortOrder'] || 'asc'
    });
  }

  performSearch(): void {
    const filters: SearchFilters = {
      query: this.searchQuery,
      page: this.currentPage,
      limit: this.itemsPerPage,
      ...this.filterForm.value
    };

    // Nettoyer les valeurs nulles/vides
    Object.keys(filters).forEach(key => {
      const filterKey = key as keyof SearchFilters;
      if (filters[filterKey] === null || filters[filterKey] === '') {
        delete filters[filterKey];
      }
    });

    // Utiliser la nouvelle recherche unifiée
    this.searchService.unifiedSearch(this.searchQuery, filters);
    this.updateUrl();
  }

  private updateUrl(): void {
    const queryParams: any = {
      q: this.searchQuery,
      page: this.currentPage > 1 ? this.currentPage : null,
      ...this.filterForm.value
    };

    // Nettoyer les paramètres vides
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === '' || queryParams[key] === false) {
        delete queryParams[key];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  private updatePagination(): void {
    if (this.searchResults) {
      this.totalPages = this.searchResults.totalPages;
    }
  }

  private extractFiltersData(): void {
    if (this.searchResults && this.searchResults.products.length > 0) {
      // Extraire les marques et catégories disponibles
      this.availableBrands = [...new Set(this.searchResults.products
        .map(p => p.brand)
        .filter(Boolean)
      )].sort();

      this.availableCategories = [...new Set(this.searchResults.products
        .map(p => p.category)
        .filter(Boolean)
      )].sort();

      // Calculer la fourchette de prix
      const prices = this.searchResults.products.map(p => p.price).filter(p => p > 0);
      if (prices.length > 0) {
        this.priceRange = {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices))
        };
      }
    }
  }

  // Navigation
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.performSearch();
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Actions sur les produits
  viewProduct(product: any): void {
    this.router.navigate(['/product', product.id || product.code || product.slug]);
  }

  addToCart(product: any): void {
    this.cartService.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess(`${product.name} ajouté au panier`);
      },
      error: (error) => {
        this.notificationService.showApiError('Erreur lors de l\'ajout au panier');
      }
    });
  }

  toggleFavorite(product: any): void {
    if (product.isFavorite) {
      this.favoritesService.removeFromFavorites(product.id).subscribe({
        next: () => {
          product.isFavorite = false;
          this.notificationService.showSuccess('Retiré des favoris');
        },
        error: () => {
          this.notificationService.showApiError('Erreur lors de la suppression');
        }
      });
    } else {
      this.favoritesService.addToFavorites(product.id).subscribe({
        next: () => {
          product.isFavorite = true;
          this.notificationService.showSuccess('Ajouté aux favoris');
        },
        error: () => {
          this.notificationService.showApiError('Erreur lors de l\'ajout');
        }
      });
    }
  }

  // Utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getProductImage(product: any): string {
    return product.image || 'assets/images/placeholders/product.jpg';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholders/product.jpg';
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  clearFilters(): void {
    this.filterForm.reset({
      category: '',
      brand: '',
      minPrice: null,
      maxPrice: null,
      inStock: false,
      sortBy: 'relevance',
      sortOrder: 'asc'
    });
  }

  // Gérer le tri rapide
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    
    let sortBy = 'relevance';
    let sortOrder = 'asc';
    
    switch (value) {
      case 'price':
        sortBy = 'price';
        sortOrder = 'asc';
        break;
      case 'price_desc':
        sortBy = 'price';
        sortOrder = 'desc';
        break;
      case 'name':
        sortBy = 'name';
        sortOrder = 'asc';
        break;
      case 'newest':
        sortBy = 'newest';
        sortOrder = 'desc';
        break;
    }
    
    this.filterForm.patchValue({ sortBy, sortOrder });
  }

  // Méthodes pour les types de recherche (réutilisées du GlobalSearchComponent)
  getSearchTypeLabel(searchType?: string): string {
    switch (searchType) {
      case 'oem':
        return 'Numéro OEM';
      case 'product_code':
        return 'Code produit';
      case 'keyword':
        return 'Mot-clé';
      case 'mixed':
        return 'Recherche mixte';
      default:
        return 'Recherche générale';
    }
  }

  getSearchTypeIcon(searchType?: string): string {
    switch (searchType) {
      case 'oem':
        return '🔢';
      case 'product_code':
        return '🏷️';
      case 'keyword':
        return '🔍';
      case 'mixed':
        return '🎯';
      default:
        return '⚡';
    }
  }

  // Vérifier si des filtres sont actifs
  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return formValue.category || 
           formValue.brand || 
           formValue.minPrice || 
           formValue.maxPrice || 
           formValue.inStock;
  }

  // Rechercher une suggestion
  searchSuggestion(suggestion: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: suggestion },
      queryParamsHandling: 'replace'
    });
  }

  // Utilitaire Math pour le template
  Math = Math;

  // Getters pour éviter les erreurs de null check dans le template
  get hasResults(): boolean {
    return !!(this.searchResults?.products?.length);
  }

  get hasSuggestions(): boolean {
    return !!(this.searchResults?.suggestions?.length);
  }

  get resultsCount(): number {
    return this.searchResults?.total || 0;
  }

  get products(): any[] {
    return this.searchResults?.products || [];
  }

  get suggestions(): string[] {
    return this.searchResults?.suggestions || [];
  }
}