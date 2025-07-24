import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService, SearchFilters } from '../services/search.service';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  searchResults: any[] = [];
  suggestions: string[] = [];
  isLoading = false;
  showSuggestions = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      subcategory: [''],
      brand: [''],
      minPrice: [null],
      maxPrice: [null],
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
          this.showSuggestions = false;
        }
      })
    );

    // Écouter les changements de tous les filtres pour la recherche automatique
    this.subscription.add(
      this.searchForm.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(filters => {
        if (filters.query && filters.query.length >= 2) {
          this.performSearch(filters);
        }
      })
    );

    // Appliquer les paramètres de l'URL
    this.applyUrlParams();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    const filters = this.searchForm.value;
    if (filters.query && filters.query.trim()) {
      this.performSearch(filters);
    }
  }

  onSuggestionClick(suggestion: string): void {
    this.searchForm.patchValue({ query: suggestion });
    this.showSuggestions = false;
    this.performSearch(this.searchForm.value);
  }

  onInputFocus(): void {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onInputBlur(): void {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchResults = [];
    this.suggestions = [];
    this.showSuggestions = false;
  }

  private loadSuggestions(query: string): void {
    this.searchService.getSuggestions(query).subscribe({
      next: (suggestions) => {
        this.suggestions = suggestions.map(s => s.text);
        this.showSuggestions = this.suggestions.length > 0;
      },
      error: (error) => {
        console.error('Error loading suggestions:', error);
      }
    });
  }

  private performSearch(filters: SearchFilters): void {
    this.isLoading = true;
    this.searchService.search(filters);
    
    // Écouter les résultats
    this.subscription.add(
      this.searchService.searchResults$.subscribe(results => {
        if (results) {
          this.searchResults = results.products;
        }
        this.isLoading = false;
      })
    );

    this.subscription.add(
      this.searchService.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      })
    );
  }

  private applyUrlParams(): void {
    this.route.queryParams.subscribe(params => {
      const formValues: any = {};
      
      if (params['q']) formValues.query = params['q'];
      if (params['category']) formValues.category = params['category'];
      if (params['subcategory']) formValues.subcategory = params['subcategory'];
      if (params['brand']) formValues.brand = params['brand'];
      if (params['minPrice']) formValues.minPrice = Number(params['minPrice']);
      if (params['maxPrice']) formValues.maxPrice = Number(params['maxPrice']);
      if (params['inStock']) formValues.inStock = params['inStock'] === 'true';
      if (params['vehicleBrand']) formValues.vehicleBrand = params['vehicleBrand'];
      if (params['vehicleModel']) formValues.vehicleModel = params['vehicleModel'];
      if (params['sortBy']) formValues.sortBy = params['sortBy'];
      if (params['sortOrder']) formValues.sortOrder = params['sortOrder'];

      this.searchForm.patchValue(formValues);
    });
  }

  onProductClick(product: any): void {
    // Navigation vers la page de détail du produit
    this.router.navigate(['/product', product.id || product.code]);
  }

  getProductImage(product: any): string {
    return product.image || 'assets/images/placeholders/product.jpg';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}
