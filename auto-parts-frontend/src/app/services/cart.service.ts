import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  oemNumber?: string;
  inStock: boolean;
  maxQuantity?: number;
  productId?: string; // Add this for compatibility
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'alopiece_cart';
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$ = this.cartSubject.asObservable();
  public cartItems$ = this.cartSubject.asObservable(); // Added this line

  constructor() {
    // Charger le panier depuis le localStorage au démarrage
    this.loadCartFromStorage();
  }

  // Méthodes principales du panier
  addToCart(product: any, quantity: number = 1): Observable<void> {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(item => item.id === product.id);

    if (existingItem) {
      // Mettre à jour la quantité si l'article existe déjà
      existingItem.quantity += quantity;
      if (existingItem.maxQuantity && existingItem.quantity > existingItem.maxQuantity) {
        existingItem.quantity = existingItem.maxQuantity;
      }
    } else {
      // Ajouter un nouvel article
      const newItem: CartItem = {
        id: product.id || product._id,
        name: product.name || product.productName,
        price: product.price || 0,
        quantity: quantity,
        image: product.image,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand || product.productBrand,
        oemNumber: product.oe || product.oemNumber,
        inStock: product.inStock !== false,
        maxQuantity: product.stockQuantity || product.maxQuantity
      };
      currentCart.items.push(newItem);
    }

    this.updateCart(currentCart);
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  removeFromCart(productId: string): Observable<void> {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.id !== productId);
    this.updateCart(currentCart);
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.maxQuantity && item.quantity > item.maxQuantity) {
        item.quantity = item.maxQuantity;
      }
      this.updateCart(currentCart);
    }
  }

  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0,
      lastUpdated: new Date()
    };
    this.updateCart(emptyCart);
  }

  // Méthodes utilitaires
  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart.itemCount);
      });
    });
  }

  getCartTotal(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart.total);
      });
    });
  }

  isInCart(productId: string): boolean {
    return this.cartSubject.value.items.some(item => item.id === productId);
  }

  getItemQuantity(productId: string): number {
    const item = this.cartSubject.value.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  toggleCart(): void {
    // This method is not fully implemented in the original file,
    // but it's added as per the edit hint.
    // For now, it will just clear the cart.
    this.clearCart();
  }

  // Méthodes privées
  private updateCart(cart: Cart): void {
    // Calculer le total et le nombre d'articles
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.lastUpdated = new Date();

    // Mettre à jour le BehaviorSubject
    this.cartSubject.next(cart);

    // Sauvegarder dans le localStorage
    this.saveCartToStorage(cart);
  }

  private getInitialCart(): Cart {
    return {
      items: [],
      total: 0,
      itemCount: 0,
      lastUpdated: new Date()
    };
  }

  private saveCartToStorage(cart: Cart): void {
    try {
      // Vérifier si localStorage est disponible (côté client uniquement)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      // Vérifier si localStorage est disponible (côté client uniquement)
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
        if (storedCart) {
          const cart = JSON.parse(storedCart);
          // Convertir la date string en objet Date
          if (cart.lastUpdated) {
            cart.lastUpdated = new Date(cart.lastUpdated);
          }
          this.cartSubject.next(cart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }

  // Méthodes pour les calculs
  calculateSubtotal(): number {
    return this.cartSubject.value.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateTax(rate: number = 0.20): number { // 20% TVA par défaut
    return this.calculateSubtotal() * rate;
  }

  calculateTotal(taxRate: number = 0.20): number {
    return this.calculateSubtotal() + this.calculateTax(taxRate);
  }

  // Méthodes pour les statistiques
  getCartStats(): { totalItems: number; totalValue: number; averagePrice: number } {
    const cart = this.cartSubject.value;
    const totalItems = cart.itemCount;
    const totalValue = cart.total;
    const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

    return {
      totalItems,
      totalValue,
      averagePrice
    };
  }
}