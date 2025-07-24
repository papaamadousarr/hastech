import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FavoritesService, FavoriteProduct } from '../../services/favorites.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="favorites-container">
      <div class="favorites-header">
        <h1>Mes Favoris</h1>
        <div class="favorites-summary">
          <span class="favorites-count">{{ favorites.length }} favori(s)</span>
          <span class="favorites-value">{{ formatPrice(getTotalValue()) }}</span>
        </div>
      </div>

      <div *ngIf="favorites.length === 0" class="empty-favorites">
        <div class="empty-favorites-icon">❤️</div>
        <h2>Vous n'avez pas encore de favoris</h2>
        <p>Ajoutez des produits à vos favoris pour les retrouver facilement</p>
        <button (click)="goToProducts()" class="btn-primary">
          Découvrir nos produits
        </button>
      </div>

      <div *ngIf="favorites.length > 0" class="favorites-content">
        <div class="favorites-toolbar">
          <div class="toolbar-left">
            <select [(ngModel)]="sortBy" (change)="onSortChange()" class="sort-select">
              <option value="addedAt">Plus récents</option>
              <option value="name">Nom</option>
              <option value="price">Prix</option>
              <option value="brand">Marque</option>
            </select>
            
            <select [(ngModel)]="sortOrder" (change)="onSortChange()" class="sort-select">
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>

            <select [(ngModel)]="filterBy" (change)="onFilterChange()" class="filter-select">
              <option value="all">Tous</option>
              <option value="inStock">En stock</option>
              <option value="outOfStock">Rupture de stock</option>
            </select>
          </div>

          <div class="toolbar-right">
            <button (click)="clearFavorites()" class="btn-secondary">
              Vider les favoris
            </button>
            <button (click)="exportFavorites()" class="btn-secondary">
              Exporter
            </button>
          </div>
        </div>

        <div class="favorites-stats">
          <div class="stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">{{ favorites.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">En stock</span>
            <span class="stat-value in-stock">{{ getInStockCount() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Rupture</span>
            <span class="stat-value out-of-stock">{{ getOutOfStockCount() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Valeur totale</span>
            <span class="stat-value">{{ formatPrice(getTotalValue()) }}</span>
          </div>
        </div>

        <div class="favorites-grid">
          <div *ngFor="let favorite of filteredFavorites; trackBy: trackByFavorite" 
               class="favorite-card">
            <div class="favorite-image">
              <img [src]="favorite.image || 'assets/images/placeholders/product.jpg'" 
                   [alt]="favorite.name"
                   (error)="onImageError($event)">
              <div class="favorite-overlay">
                <button (click)="addToCart(favorite)" 
                        [disabled]="!favorite.inStock"
                        class="overlay-btn cart-btn"
                        title="Ajouter au panier">
                  🛒
                </button>
                <button (click)="removeFromFavorites(favorite.id)" 
                        class="overlay-btn remove-btn"
                        title="Retirer des favoris">
                  ❌
                </button>
              </div>
            </div>
            
            <div class="favorite-info">
              <h3 class="favorite-name">{{ favorite.name }}</h3>
              <div class="favorite-meta">
                <span *ngIf="favorite.brand" class="favorite-brand">{{ favorite.brand }}</span>
                <span *ngIf="favorite.category" class="favorite-category">{{ favorite.category }}</span>
              </div>
              <div class="favorite-price">{{ formatPrice(favorite.price) }}</div>
              <div class="favorite-stock" [ngClass]="{'in-stock': favorite.inStock, 'out-of-stock': !favorite.inStock}">
                {{ favorite.inStock ? 'En stock' : 'Rupture de stock' }}
              </div>
              <div class="favorite-date">
                Ajouté le {{ formatDate(favorite.addedAt) }}
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredFavorites.length === 0" class="no-filtered-results">
          <h3>Aucun favori ne correspond aux filtres</h3>
          <button (click)="clearFilters()" class="btn-primary">
            Effacer les filtres
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .favorites-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .favorites-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .favorites-summary {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .favorites-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .favorites-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #059669;
    }

    .empty-favorites {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-favorites-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-favorites h2 {
      font-size: 1.5rem;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .empty-favorites p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .favorites-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .toolbar-left, .toolbar-right {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .sort-select, .filter-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
    }

    .favorites-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .stat-value.in-stock {
      color: #059669;
    }

    .stat-value.out-of-stock {
      color: #dc2626;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .favorite-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: all 0.2s;
      position: relative;
    }

    .favorite-card:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .favorite-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .favorite-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }

    .favorite-card:hover .favorite-image img {
      transform: scale(1.05);
    }

    .favorite-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .favorite-card:hover .favorite-overlay {
      opacity: 1;
    }

    .overlay-btn {
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.2s;
    }

    .overlay-btn:hover {
      transform: scale(1.1);
    }

    .overlay-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .favorite-info {
      padding: 1rem;
    }

    .favorite-name {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      line-height: 1.4;
    }

    .favorite-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .favorite-brand {
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .favorite-category {
      background: #eff6ff;
      color: #1e40af;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .favorite-price {
      font-weight: 600;
      color: #059669;
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    .favorite-stock {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .favorite-stock.in-stock {
      color: #059669;
    }

    .favorite-stock.out-of-stock {
      color: #dc2626;
    }

    .favorite-date {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .no-filtered-results {
      text-align: center;
      padding: 4rem 2rem;
    }

    .no-filtered-results h3 {
      color: #374151;
      margin-bottom: 1rem;
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

    @media (max-width: 768px) {
      .favorites-toolbar {
        flex-direction: column;
        gap: 1rem;
      }

      .toolbar-left, .toolbar-right {
        width: 100%;
        justify-content: center;
      }

      .favorites-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .favorites-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: FavoriteProduct[] = [];
  filteredFavorites: FavoriteProduct[] = [];
  sortBy: 'name' | 'price' | 'addedAt' | 'brand' = 'addedAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  filterBy: 'all' | 'inStock' | 'outOfStock' = 'all';
  private subscription = new Subscription();

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.favoritesService.favorites$.subscribe(favorites => {
        this.favorites = favorites;
        this.applyFiltersAndSort();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Méthodes de gestion des favoris
  removeFromFavorites(productId: string): void {
    this.favoritesService.removeFromFavorites(productId);
  }

  clearFavorites(): void {
    this.favoritesService.clearFavorites();
  }

  addToCart(favorite: FavoriteProduct): void {
    this.cartService.addToCart(favorite);
  }

  // Méthodes de tri et filtrage
  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.filterBy = 'all';
    this.sortBy = 'addedAt';
    this.sortOrder = 'desc';
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    // Appliquer les filtres
    let filtered = [...this.favorites];
    
    switch (this.filterBy) {
      case 'inStock':
        filtered = filtered.filter(fav => fav.inStock);
        break;
      case 'outOfStock':
        filtered = filtered.filter(fav => !fav.inStock);
        break;
      default:
        // 'all' - pas de filtre
        break;
    }

    // Appliquer le tri
    this.favoritesService.sortFavorites(this.sortBy, this.sortOrder);
    this.filteredFavorites = filtered;
  }

  // Méthodes de statistiques
  getInStockCount(): number {
    return this.favorites.filter(fav => fav.inStock).length;
  }

  getOutOfStockCount(): number {
    return this.favorites.filter(fav => !fav.inStock).length;
  }

  getTotalValue(): number {
    return this.favorites.reduce((sum, fav) => sum + fav.price, 0);
  }

  // Méthodes utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  trackByFavorite(index: number, favorite: FavoriteProduct): string {
    return favorite.id;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholders/product.jpg';
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  exportFavorites(): void {
    const favoritesJson = this.favoritesService.exportFavorites();
    const blob = new Blob([favoritesJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes-favoris.json';
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.notificationService.success(
      'Favoris exportés',
      'Vos favoris ont été exportés avec succès'
    );
  }
} 