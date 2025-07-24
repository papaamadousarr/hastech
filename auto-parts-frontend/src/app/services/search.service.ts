import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NotificationService } from './notification.service';

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  vehicleBrand?: string;
  vehicleModel?: string;
  year?: number;
  sortBy?: 'name' | 'price' | 'relevance' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: any[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchFilters;
  suggestions: string[];
  searchType?: string; // Type de recherche détecté : 'oem', 'product_code', 'keyword', 'mixed'
  query?: string;      // Requête originale
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'vehicle';
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000/api';
  
  private searchFilters = new BehaviorSubject<SearchFilters>({});
  private searchResults = new BehaviorSubject<SearchResult | null>(null);
  private isLoading = new BehaviorSubject<boolean>(false);

  public searchFilters$ = this.searchFilters.asObservable();
  public searchResults$ = this.searchResults.asObservable();
  public isLoading$ = this.isLoading.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    // Déclencher la recherche automatiquement quand les filtres changent
    this.searchFilters$.pipe(
      debounceTime(300), // Attendre 300ms après le dernier changement
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(filters => this.performSearch(filters))
    ).subscribe({
      next: (results) => {
        this.searchResults.next(results);
        this.isLoading.next(false);
      },
      error: (error) => {
        this.notificationService.showApiError(error);
        this.isLoading.next(false);
      }
    });
  }

  // Méthodes principales
  search(filters: Partial<SearchFilters>): void {
    const currentFilters = this.searchFilters.value;
    const newFilters = { ...currentFilters, ...filters, page: 1 }; // Reset à la page 1
    this.isLoading.next(true);
    this.searchFilters.next(newFilters);
  }

  updateFilters(filters: Partial<SearchFilters>): void {
    const currentFilters = this.searchFilters.value;
    const newFilters = { ...currentFilters, ...filters };
    this.searchFilters.next(newFilters);
  }

  clearFilters(): void {
    this.searchFilters.next({});
  }

  loadMore(): void {
    const currentFilters = this.searchFilters.value;
    const currentResults = this.searchResults.value;
    
    if (currentResults && currentFilters.page && currentFilters.page < currentResults.totalPages) {
      this.updateFilters({ page: currentFilters.page + 1 });
    }
  }

  // Recherche avec suggestions
  getSuggestions(query: string): Observable<SearchSuggestion[]> {
    if (!query || query.length < 2) {
      return new Observable(observer => observer.next([]));
    }

    const params = new HttpParams().set('q', query).set('limit', '10');
    return this.http.get<SearchSuggestion[]>(`${this.apiUrl}/search/suggestions`, { params }).pipe(
      map(suggestions => suggestions || []),
      map(suggestions => suggestions.map(s => ({
        text: typeof s === 'string' ? s : (s.text || ''),
        type: (typeof s === 'object' && s.type) ? s.type : 'product',
        count: typeof s === 'object' ? s.count : undefined
      })))
    );
  }

  // Recherche rapide (pour la barre de recherche)
  quickSearch(query: string): Observable<any[]> {
    if (!query || query.length < 2) {
      return new Observable(observer => observer.next([]));
    }

    const params = new HttpParams()
      .set('q', query)
      .set('limit', '5');

    return this.http.get<any[]>(`${this.apiUrl}/search/quick`, { params }).pipe(
      map(results => results || [])
    );
  }

  // Recherche par véhicule
  searchByVehicle(vehicleBrand: string, vehicleModel: string, year?: number): void {
    this.search({
      vehicleBrand,
      vehicleModel,
      year
    });
  }

  // Recherche par catégorie
  searchByCategory(category: string, subcategory?: string): void {
    this.search({
      category,
      subcategory
    });
  }

  // Recherche par marque
  searchByBrand(brand: string): void {
    this.search({ brand });
  }

  // Nouvelle recherche unifiée intelligente (OEM/Code/Mot-clé)
  unifiedSearch(query: string, additionalFilters?: Partial<SearchFilters>): void {
    if (!query || query.trim().length < 1) {
      this.searchResults.next(null);
      return;
    }

    this.isLoading.next(true);
    
    // Construire les paramètres pour l'API unifiée
    const filters: SearchFilters = {
      query: query.trim(),
      page: 1,
      limit: 20,
      ...additionalFilters
    };

    // Utiliser l'API de recherche unifiée
    this.performUnifiedSearch(filters).subscribe({
      next: (results) => {
        this.searchResults.next(results);
        this.isLoading.next(false);
        
        // Mettre à jour les filtres actuels
        this.searchFilters.next(filters);
      },
      error: (error) => {
        console.error('Unified search error:', error);
        this.notificationService.showApiError(error);
        this.isLoading.next(false);
      }
    });
  }

  // Méthodes privées
  private performSearch(filters: SearchFilters): Observable<SearchResult> {
    const params = this.buildSearchParams(filters);
    
    return this.http.get<SearchResult>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => {
        // Enrichir les résultats avec des suggestions
        const suggestions = this.generateSuggestions(filters, response);
        return {
          ...response,
          suggestions
        };
      })
    );
  }

  // Nouvelle méthode pour la recherche unifiée
  private performUnifiedSearch(filters: SearchFilters): Observable<SearchResult> {
    const params = this.buildSearchParams(filters);
    
    return this.http.get<SearchResult>(`${this.apiUrl}/search/unified`, { params }).pipe(
      map(response => {
        // La réponse contient déjà les suggestions intelligentes du backend
        return {
          ...response,
          filters: filters // S'assurer que les filtres sont bien inclus
        };
      })
    );
  }

  private buildSearchParams(filters: SearchFilters): HttpParams {
    let params = new HttpParams();

    if (filters.query) params = params.set('q', filters.query);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.subcategory) params = params.set('subcategory', filters.subcategory);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params = params.set('inStock', filters.inStock.toString());
    if (filters.vehicleBrand) params = params.set('vehicleBrand', filters.vehicleBrand);
    if (filters.vehicleModel) params = params.set('vehicleModel', filters.vehicleModel);
    if (filters.year) params = params.set('year', filters.year.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return params;
  }

  private generateSuggestions(filters: SearchFilters, results: SearchResult): string[] {
    const suggestions: string[] = [];

    // Suggestions basées sur les catégories populaires
    if (results.products.length > 0) {
      const categories = [...new Set(results.products.map(p => p.category).filter(Boolean))];
      suggestions.push(...categories.slice(0, 3));
    }

    // Suggestions basées sur les marques populaires
    if (results.products.length > 0) {
      const brands = [...new Set(results.products.map(p => p.brand).filter(Boolean))];
      suggestions.push(...brands.slice(0, 3));
    }

    // Suggestions basées sur la requête
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const commonTerms = ['frein', 'pneu', 'huile', 'filtre', 'batterie', 'amortisseur'];
      const matchingTerms = commonTerms.filter(term => term.includes(query) || query.includes(term));
      suggestions.push(...matchingTerms);
    }

    return [...new Set(suggestions)].slice(0, 5);
  }

  // Méthodes utilitaires
  getCurrentFilters(): SearchFilters {
    return this.searchFilters.value;
  }

  getCurrentResults(): SearchResult | null {
    return this.searchResults.value;
  }

  hasMorePages(): boolean {
    const results = this.searchResults.value;
    const filters = this.searchFilters.value;
    return results ? (filters.page || 1) < results.totalPages : false;
  }

  getTotalResults(): number {
    return this.searchResults.value?.total || 0;
  }

  // Méthodes pour les filtres de prix
  setPriceRange(minPrice: number, maxPrice: number): void {
    this.updateFilters({ minPrice, maxPrice });
  }

  clearPriceRange(): void {
    const currentFilters = this.searchFilters.value;
    const { minPrice, maxPrice, ...rest } = currentFilters;
    this.searchFilters.next(rest);
  }

  // Méthodes pour le tri
  setSorting(sortBy: SearchFilters['sortBy'], sortOrder: SearchFilters['sortOrder'] = 'asc'): void {
    this.updateFilters({ sortBy, sortOrder });
  }

  // Méthodes pour la pagination
  goToPage(page: number): void {
    this.updateFilters({ page });
  }

  nextPage(): void {
    const currentFilters = this.searchFilters.value;
    const currentPage = currentFilters.page || 1;
    this.updateFilters({ page: currentPage + 1 });
  }

  previousPage(): void {
    const currentFilters = this.searchFilters.value;
    const currentPage = currentFilters.page || 1;
    if (currentPage > 1) {
      this.updateFilters({ page: currentPage - 1 });
    }
  }
} 