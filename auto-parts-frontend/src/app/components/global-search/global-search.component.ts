import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService, SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.css'
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Rechercher une pièce, marque, référence...';
  @Input() showSuggestions: boolean = true;
  @Input() showSearchType: boolean = false;
  @Output() searchResult = new EventEmitter<SearchResult | null>();

  searchControl = new FormControl('');
  searchResults: SearchResult | null = null;
  isLoading = false;
  showDropdown = false;
  suggestions: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Écouter les changements dans le champ de recherche
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après la dernière saisie
        distinctUntilChanged(), // Éviter les doublons
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.trim().length >= 2) {
          this.performSearch(query.trim());
          if (this.showSuggestions) {
            this.loadSuggestions(query.trim());
          }
        } else {
          this.clearResults();
        }
      });

    // Écouter les résultats du service de recherche
    this.searchService.searchResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
        this.searchResult.emit(results);
        
        if (results && this.showSuggestions) {
          this.suggestions = results.suggestions || [];
        }
      });

    // Écouter l'état de chargement
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

  performSearch(query: string): void {
    if (!query.trim()) return;
    
    // Utiliser la nouvelle recherche unifiée
    this.searchService.unifiedSearch(query);
  }

  onInputFocus(): void {
    if (this.suggestions.length > 0) {
      this.showDropdown = true;
    }
  }

  onInputBlur(): void {
    // Délai pour permettre les clics sur les suggestions
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onSuggestionClick(suggestion: string): void {
    this.searchControl.setValue(suggestion);
    this.showDropdown = false;
    this.performSearch(suggestion);
  }

  onSearchSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    const query = this.searchControl.value;
    if (query && query.trim()) {
      this.showDropdown = false;
      this.router.navigate(['/search'], {
        queryParams: { q: query.trim() }
      });
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.clearResults();
  }

  private clearResults(): void {
    this.searchResults = null;
    this.suggestions = [];
    this.showDropdown = false;
    this.searchResult.emit(null);
  }

  private loadSuggestions(query: string): void {
    this.searchService.getSuggestions(query).subscribe({
      next: (suggestions) => {
        this.suggestions = suggestions.map(s => s.text);
        this.showDropdown = this.suggestions.length > 0;
      },
      error: (error) => {
        console.error('Error loading suggestions:', error);
      }
    });
  }

  // Détecteur de type de recherche pour l'affichage
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

  formatPrice(price: number): string {
    if (!price || price === 0) return 'Prix non renseigné';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  }
}