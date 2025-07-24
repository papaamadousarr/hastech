import { Injectable } from '@angular/core';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Nettoyer le cache périodiquement
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000); // Toutes les minutes
  }

  set<T>(key: string, data: T, expiry?: number): void {
    const expiryTime = expiry || this.DEFAULT_EXPIRY;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiryTime
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.expiry;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Méthodes utilitaires pour les catégories
  getCategoryKey(): string {
    return 'categories';
  }

  getSubcategoryKey(categoryId: string): string {
    return `subcategories_${categoryId}`;
  }

  // Statistiques du cache
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
} 