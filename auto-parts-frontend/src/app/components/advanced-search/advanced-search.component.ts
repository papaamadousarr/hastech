import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService, SearchFilters, SearchSuggestion } from '../../services/search.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="advanced-search-container">
      <div class="search-header">
        <h1>Recherche avancée</h1>
        <p>Trouvez exactement ce que vous cherchez avec nos filtres avancés</p>
      </div>

      <div class="search-form-container">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
          <div class="form-row">
            <div class="form-group">
              <label for="query">Recherche</label>
              <input 
                type="text" 
                id="query" 
                formControlName="query"
                placeholder="Nom du produit, marque, référence..."
                class="form-input">
              <div *ngIf="suggestions.length > 0" class="suggestions">
                <div *ngFor="let suggestion of suggestions" 
                     (click)="selectSuggestion(suggestion)"
                     class="suggestion-item">
                  <span class="suggestion-text">{{ suggestion.text }}</span>
                  <span class="suggestion-type">{{ getSuggestionTypeLabel(suggestion.type) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Catégorie</label>
              <select id="category" formControlName="category" class="form-select">
                <option value="">Toutes les catégories</option>
                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="subcategory">Sous-catégorie</label>
              <select id="subcategory" formControlName="subcategory" class="form-select">
                <option value="">Toutes les sous-catégories</option>
                <option *ngFor="let subcat of subcategories" [value]="subcat">{{ subcat }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="brand">Marque</label>
              <select id="brand" formControlName="brand" class="form-select">
                <option value="">Toutes les marques</option>
                <option *ngFor="let brand of brands" [value]="brand">{{ brand }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="minPrice">Prix minimum</label>
              <input 
                type="number" 
                id="minPrice" 
                formControlName="minPrice"
                placeholder="0"
                class="form-input">
            </div>

            <div class="form-group">
              <label for="maxPrice">Prix maximum</label>
              <input 
                type="number" 
                id="maxPrice" 
                formControlName="maxPrice"
                placeholder="1000"
                class="form-input">
            </div>

            <div class="form-group">
              <label for="vehicleBrand">Marque véhicule</label>
              <select id="vehicleBrand" formControlName="vehicleBrand" class="form-select">
                <option value="">Toutes les marques</option>
                <option *ngFor="let vBrand of vehicleBrands" [value]="vBrand">{{ vBrand }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="vehicleModel">Modèle véhicule</label>
              <select id="vehicleModel" formControlName="vehicleModel" class="form-select">
                <option value="">Tous les modèles</option>
                <option *ngFor="let vModel of vehicleModels" [value]="vModel">{{ vModel }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="inStock" class="form-checkbox">
                <span class="checkmark"></span>
                En stock uniquement
              </label>
            </div>

            <div class="form-group">
              <label for="sortBy">Trier par</label>
              <select id="sortBy" formControlName="sortBy" class="form-select">
                <option value="relevance">Pertinence</option>
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>

            <div class="form-group">
              <label for="sortOrder">Ordre</label>
              <select id="sortOrder" formControlName="sortOrder" class="form-select">
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" (click)="clearFilters()" class="btn-secondary">
              Effacer les filtres
            </button>
            <button type="submit" class="btn-primary">
              Rechercher
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="searchResults" class="search-results">
        <div class="results-header">
          <h2>Résultats de recherche</h2>
          <div class="results-info">
            <span>{{ searchResults.total }} produit(s) trouvé(s)</span>
            <span *ngIf="searchResults.totalPages > 1">
              Page {{ searchResults.page }} sur {{ searchResults.totalPages }}
            </span>
          </div>
        </div>

        <div *ngIf="searchResults.suggestions.length > 0" class="search-suggestions">
          <h3>Suggestions</h3>
          <div class="suggestions-tags">
            <span *ngFor="let suggestion of searchResults.suggestions" 
                  (click)="applySuggestion(suggestion)"
                  class="suggestion-tag">
              {{ suggestion }}
            </span>
          </div>
        </div>

        <div *ngIf="searchResults.products.length === 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Aucun résultat trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
          <button (click)="clearFilters()" class="btn-primary">
            Effacer les filtres
          </button>
        </div>

        <div *ngIf="searchResults.products.length > 0" class="products-grid">
          <div *ngFor="let product of searchResults.products" class="product-card">
            <div class="product-image">
              <img [src]="product.image || 'assets/images/placeholders/product.jpg'" 
                   [alt]="product.name"
                   (error)="onImageError($event)">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-meta">
                <span *ngIf="product.brand" class="product-brand">{{ product.brand }}</span>
                <span *ngIf="product.oemNumber" class="product-oem">OEM: {{ product.oemNumber }}</span>
              </div>
              <div class="product-price">{{ formatPrice(product.price) }}</div>
              <div class="product-stock" [ngClass]="{'in-stock': product.inStock, 'out-of-stock': !product.inStock}">
                {{ product.inStock ? 'En stock' : 'Rupture de stock' }}
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="searchResults.totalPages > 1" class="pagination">
          <button (click)="previousPage()" 
                  [disabled]="searchResults.page <= 1"
                  class="pagination-btn">
            Précédent
          </button>
          
          <div class="page-numbers">
            <button *ngFor="let page of getPageNumbers()" 
                    (click)="goToPage(page)"
                    [class.active]="page === searchResults.page"
                    class="page-btn">
              {{ page }}
            </button>
          </div>
          
          <button (click)="nextPage()" 
                  [disabled]="searchResults.page >= searchResults.totalPages"
                  class="pagination-btn">
            Suivant
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .advanced-search-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .search-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .search-header h1 {
      font-size: 2rem;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .search-header p {
      color: #6b7280;
      font-size: 1.125rem;
    }

    .search-form-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .search-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input, .form-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #059669;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .form-checkbox {
      width: 1rem;
      height: 1rem;
      accent-color: #059669;
    }

    .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10;
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestion-item {
      padding: 0.75rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f3f4f6;
    }

    .suggestion-item:hover {
      background: #f9fafb;
    }

    .suggestion-text {
      font-weight: 500;
    }

    .suggestion-type {
      font-size: 0.75rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #059669;
      color: white;
    }

    .btn-primary:hover {
      background: #047857;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .search-results {
      margin-top: 2rem;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .results-header h2 {
      margin: 0;
      color: #1f2937;
    }

    .results-info {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .search-suggestions {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 0.375rem;
    }

    .search-suggestions h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #166534;
    }

    .suggestions-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .suggestion-tag {
      background: #dcfce7;
      color: #166534;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .suggestion-tag:hover {
      background: #bbf7d0;
    }

    .no-results {
      text-align: center;
      padding: 4rem 2rem;
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .no-results p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .product-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .product-card:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .product-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .product-info {
      padding: 1rem;
    }

    .product-name {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    .product-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .product-price {
      font-weight: 600;
      color: #059669;
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    .product-stock {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .product-stock.in-stock {
      color: #059669;
    }

    .product-stock.out-of-stock {
      color: #dc2626;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f9fafb;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }

    .page-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-btn:hover {
      background: #f9fafb;
    }

    .page-btn.active {
      background: #059669;
      color: white;
      border-color: #059669;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .results-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  searchResults: any = null;
  suggestions: SearchSuggestion[] = [];
  private subscription = new Subscription();

  // Données pour les filtres
  categories: string[] = [];
  subcategories: string[] = [];
  brands: string[] = [];
  vehicleBrands: string[] = [];
  vehicleModels: string[] = [];

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      subcategory: [''],
      brand: [''],
      minPrice: [''],
      maxPrice: [''],
      inStock: [false],
      vehicleBrand: [''],
      vehicleModel: [''],
      sortBy: ['relevance'],
      sortOrder: ['asc']
    });
  }

  ngOnInit(): void {
    // Écouter les changements de la requête pour les suggestions
    this.subscription.add(
      this.searchForm.get('query')?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(query => {
        if (query && query.length >= 2) {
          this.loadSuggestions(query);
        } else {
          this.suggestions = [];
        }
      })
    );

    // Écouter les résultats de recherche
    this.subscription.add(
      this.searchService.searchResults$.subscribe(results => {
        this.searchResults = results;
      })
    );

    // Charger les données initiales
    this.loadFilterData();
    
    // Appliquer les paramètres de l'URL
    this.applyUrlParams();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Méthodes de recherche
  onSearch(): void {
    const filters = this.searchForm.value;
    this.searchService.search(filters);
  }

  clearFilters(): void {
    this.searchForm.reset({
      query: '',
      category: '',
      subcategory: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      vehicleBrand: '',
      vehicleModel: '',
      sortBy: 'relevance',
      sortOrder: 'asc'
    });
    this.searchService.clearFilters();
  }

  // Méthodes de suggestions
  loadSuggestions(query: string): void {
    this.searchService.getSuggestions(query).subscribe(suggestions => {
      this.suggestions = suggestions;
    });
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    this.searchForm.patchValue({ query: suggestion.text });
    this.suggestions = [];
    this.onSearch();
  }

  applySuggestion(suggestion: string): void {
    this.searchForm.patchValue({ query: suggestion });
    this.onSearch();
  }

  // Méthodes de pagination
  previousPage(): void {
    this.searchService.previousPage();
  }

  nextPage(): void {
    this.searchService.nextPage();
  }

  goToPage(page: number): void {
    this.searchService.goToPage(page);
  }

  getPageNumbers(): number[] {
    if (!this.searchResults) return [];
    
    const current = this.searchResults.page;
    const total = this.searchResults.totalPages;
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Méthodes utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getSuggestionTypeLabel(type: string): string {
    const labels = {
      product: 'Produit',
      category: 'Catégorie',
      brand: 'Marque',
      vehicle: 'Véhicule'
    };
    return labels[type as keyof typeof labels] || type;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholders/product.jpg';
  }

  // Méthodes privées
  private loadFilterData(): void {
    // Charger les données pour les filtres
    // Ces données devraient venir de votre API
    this.categories = ['Freins', 'Pneus', 'Huiles', 'Filtres', 'Batteries'];
    this.brands = ['Bosch', 'Continental', 'Michelin', 'Castrol', 'Mann'];
    this.vehicleBrands = ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Renault'];
  }

  private applyUrlParams(): void {
    this.route.queryParams.subscribe(params => {
      const filters: any = {};
      
      if (params['q']) filters.query = params['q'];
      if (params['category']) filters.category = params['category'];
      if (params['brand']) filters.brand = params['brand'];
      if (params['minPrice']) filters.minPrice = parseInt(params['minPrice']);
      if (params['maxPrice']) filters.maxPrice = parseInt(params['maxPrice']);
      if (params['inStock']) filters.inStock = params['inStock'] === 'true';
      if (params['vehicleBrand']) filters.vehicleBrand = params['vehicleBrand'];
      if (params['vehicleModel']) filters.vehicleModel = params['vehicleModel'];
      if (params['sortBy']) filters.sortBy = params['sortBy'];
      if (params['sortOrder']) filters.sortOrder = params['sortOrder'];
      
      if (Object.keys(filters).length > 0) {
        this.searchForm.patchValue(filters);
        this.onSearch();
      }
    });
  }
} 