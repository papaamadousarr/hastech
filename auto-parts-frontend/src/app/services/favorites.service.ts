import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { NotificationService } from './notification.service';

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
  addedAt: Date;
  inStock: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/api';
  private readonly FAVORITES_STORAGE_KEY = 'alopiece_favorites';
  
  private favorites = new BehaviorSubject<FavoriteProduct[]>([]);
  public favorites$ = this.favorites.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.loadFavoritesFromStorage();
  }

  // Méthodes principales
  addToFavorites(product: any): Observable<void> {
    const currentFavorites = this.favorites.value;
    const existingFavorite = currentFavorites.find(fav => fav.id === product.id);

    if (existingFavorite) {
      this.notificationService.info(
        'Déjà dans les favoris',
        'Ce produit est déjà dans vos favoris'
      );
      return new Observable(observer => {
        observer.next();
        observer.complete();
      });
    }

    const newFavorite: FavoriteProduct = {
      id: product.id || product._id,
      name: product.name || product.productName,
      price: product.price || 0,
      image: product.image,
      brand: product.brand || product.productBrand,
      category: product.category,
      addedAt: new Date(),
      inStock: product.inStock !== false
    };

    const updatedFavorites = [...currentFavorites, newFavorite];
    this.favorites.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);

    this.notificationService.success(
      'Ajouté aux favoris',
      `${newFavorite.name} a été ajouté à vos favoris`
    );

    // Synchroniser avec le serveur si l'utilisateur est connecté
    this.syncWithServer(newFavorite, 'add');

    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  removeFromFavorites(productId: string): Observable<void> {
    const currentFavorites = this.favorites.value;
    const favoriteToRemove = currentFavorites.find(fav => fav.id === productId);
    
    if (!favoriteToRemove) {
      return new Observable(observer => {
        observer.next();
        observer.complete();
      });
    }

    const updatedFavorites = currentFavorites.filter(fav => fav.id !== productId);
    this.favorites.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);

    this.notificationService.info(
      'Retiré des favoris',
      `${favoriteToRemove.name} a été retiré de vos favoris`
    );

    // Synchroniser avec le serveur si l'utilisateur est connecté
    this.syncWithServer(favoriteToRemove, 'remove');

    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  clearFavorites(): void {
    this.favorites.next([]);
    this.saveFavoritesToStorage([]);
    
    this.notificationService.info(
      'Favoris vidés',
      'Tous vos favoris ont été supprimés'
    );
  }

  // Méthodes utilitaires
  getFavorites(): Observable<FavoriteProduct[]> {
    return this.favorites.asObservable();
  }

  isFavorite(productId: string): boolean {
    return this.favorites.value.some(fav => fav.id === productId);
  }

  getFavoritesCount(): Observable<number> {
    return new Observable(observer => {
      this.favorites$.subscribe(favorites => {
        observer.next(favorites.length);
      });
    });
  }

  getFavoritesByCategory(category: string): FavoriteProduct[] {
    return this.favorites.value.filter(fav => fav.category === category);
  }

  getFavoritesByBrand(brand: string): FavoriteProduct[] {
    return this.favorites.value.filter(fav => fav.brand === brand);
  }

  getInStockFavorites(): FavoriteProduct[] {
    return this.favorites.value.filter(fav => fav.inStock);
  }

  getOutOfStockFavorites(): FavoriteProduct[] {
    return this.favorites.value.filter(fav => !fav.inStock);
  }

  // Méthodes de tri et filtrage
  sortFavorites(sortBy: 'name' | 'price' | 'addedAt' | 'brand', order: 'asc' | 'desc' = 'asc'): void {
    const currentFavorites = [...this.favorites.value];
    
    currentFavorites.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'addedAt':
          aValue = a.addedAt.getTime();
          bValue = b.addedAt.getTime();
          break;
        case 'brand':
          aValue = (a.brand || '').toLowerCase();
          bValue = (b.brand || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    this.favorites.next(currentFavorites);
  }

  // Méthodes de recherche dans les favoris
  searchInFavorites(query: string): FavoriteProduct[] {
    if (!query.trim()) {
      return this.favorites.value;
    }

    const searchTerm = query.toLowerCase();
    return this.favorites.value.filter(fav => 
      fav.name.toLowerCase().includes(searchTerm) ||
      (fav.brand && fav.brand.toLowerCase().includes(searchTerm)) ||
      (fav.category && fav.category.toLowerCase().includes(searchTerm))
    );
  }

  // Méthodes de statistiques
  getFavoritesStats(): {
    total: number;
    inStock: number;
    outOfStock: number;
    totalValue: number;
    averagePrice: number;
    categories: { [key: string]: number };
    brands: { [key: string]: number };
  } {
    const favorites = this.favorites.value;
    const inStock = favorites.filter(fav => fav.inStock).length;
    const outOfStock = favorites.filter(fav => !fav.inStock).length;
    const totalValue = favorites.reduce((sum, fav) => sum + fav.price, 0);
    const averagePrice = favorites.length > 0 ? totalValue / favorites.length : 0;

    const categories: { [key: string]: number } = {};
    const brands: { [key: string]: number } = {};

    favorites.forEach(fav => {
      if (fav.category) {
        categories[fav.category] = (categories[fav.category] || 0) + 1;
      }
      if (fav.brand) {
        brands[fav.brand] = (brands[fav.brand] || 0) + 1;
      }
    });

    return {
      total: favorites.length,
      inStock,
      outOfStock,
      totalValue,
      averagePrice,
      categories,
      brands
    };
  }

  // Méthodes de synchronisation
  syncWithServer(favorite: FavoriteProduct, action: 'add' | 'remove'): void {
    // Vérifier si l'utilisateur est connecté (token présent)
    const token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('token') : null;
    if (!token) {
      return; // Synchronisation locale seulement
    }

    const endpoint = action === 'add' ? 'favorites/add' : 'favorites/remove';
    
    this.http.post(`${this.apiUrl}/${endpoint}`, { productId: favorite.id }).pipe(
      catchError(error => {
        console.error('Error syncing favorites with server:', error);
        return of(null);
      })
    ).subscribe();
  }

  loadFavoritesFromServer(): Observable<FavoriteProduct[]> {
    const token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('token') : null;
    if (!token) {
      return of([]);
    }

    return this.http.get<FavoriteProduct[]>(`${this.apiUrl}/favorites`).pipe(
      map(favorites => {
        // Mettre à jour les favoris locaux avec ceux du serveur
        this.favorites.next(favorites);
        this.saveFavoritesToStorage(favorites);
        return favorites;
      }),
      catchError(error => {
        console.error('Error loading favorites from server:', error);
        return of([]);
      })
    );
  }

  // Méthodes privées
  private saveFavoritesToStorage(favorites: FavoriteProduct[]): void {
    try {
      // Vérifier si localStorage est disponible (pas en SSR)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }

  private loadFavoritesFromStorage(): void {
    try {
      // Vérifier si localStorage est disponible (pas en SSR)
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedFavorites = localStorage.getItem(this.FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          // Convertir les dates string en objets Date
          favorites.forEach((fav: FavoriteProduct) => {
            if (fav.addedAt) {
              fav.addedAt = new Date(fav.addedAt);
            }
          });
          this.favorites.next(favorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }

  // Méthodes d'export/import
  exportFavorites(): string {
    const favorites = this.favorites.value;
    return JSON.stringify(favorites, null, 2);
  }

  importFavorites(favoritesJson: string): boolean {
    try {
      const favorites = JSON.parse(favoritesJson);
      if (Array.isArray(favorites)) {
        // Valider et convertir les dates
        const validFavorites = favorites.map(fav => ({
          ...fav,
          addedAt: fav.addedAt ? new Date(fav.addedAt) : new Date()
        }));
        
        this.favorites.next(validFavorites);
        this.saveFavoritesToStorage(validFavorites);
        
        this.notificationService.success(
          'Favoris importés',
          `${validFavorites.length} favoris ont été importés`
        );
        
        return true;
      }
    } catch (error) {
      this.notificationService.error(
        'Erreur d\'import',
        'Le fichier de favoris n\'est pas valide'
      );
    }
    return false;
  }
} 