import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  stockQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api';
  
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private isCartVisible = new BehaviorSubject<boolean>(false);
  isCartVisible$ = this.isCartVisible.asObservable();

  private cartTotal = new BehaviorSubject<number>(0);
  cartTotal$ = this.cartTotal.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadCartFromLocalStorage();
    }
  }

  private loadCartFromLocalStorage(): void {
    if (this.isBrowser) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        this.cartItems.next(items);
        this.updateCartTotal();
      }
    }
  }

  private saveCartToLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    }
  }

  private updateCartTotal(): void {
    const total = this.cartItems.value.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    this.cartTotal.next(total);
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    if (existingItem) {
      if (existingItem.quantity + 1 <= existingItem.stockQuantity) {
        existingItem.quantity += 1;
        this.cartItems.next([...currentItems]);
      } else {
        console.warn('Cannot add more items - Stock limit reached');
      }
    } else {
      const newItem = { ...item, quantity: 1 };
      this.cartItems.next([...currentItems, newItem]);
    }

    this.updateCartTotal();
    this.saveCartToLocalStorage();
    this.syncCartWithServer();
  }

  removeFromCart(itemId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
    this.updateCartTotal();
    this.saveCartToLocalStorage();
    this.syncCartWithServer();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => i.id === itemId);

    if (item) {
      if (quantity <= item.stockQuantity && quantity > 0) {
        item.quantity = quantity;
        this.cartItems.next([...currentItems]);
        this.updateCartTotal();
        this.saveCartToLocalStorage();
        this.syncCartWithServer();
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.updateCartTotal();
    if (this.isBrowser) {
      localStorage.removeItem('cart');
    }
    this.syncCartWithServer();
  }

  toggleCart(): void {
    this.isCartVisible.next(!this.isCartVisible.value);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  private syncCartWithServer(): void {
    if (this.isBrowser && localStorage.getItem('token')) {
      this.http.post(`${this.apiUrl}/cart/sync`, {
        items: this.cartItems.value
      }).subscribe({
        error: (error) => console.error('Error syncing cart:', error)
      });
    }
  }

  loadCartFromServer(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart`);
  }

  mergeWithServerCart(serverCart: CartItem[]): void {
    const localCart = this.cartItems.value;
    const mergedCart = [...localCart];

    serverCart.forEach(serverItem => {
      const existingItem = mergedCart.find(item => item.id === serverItem.id);
      if (existingItem) {
        existingItem.quantity = Math.min(
          Math.max(existingItem.quantity, serverItem.quantity),
          existingItem.stockQuantity
        );
      } else {
        mergedCart.push(serverItem);
      }
    });

    this.cartItems.next(mergedCart);
    this.updateCartTotal();
    this.saveCartToLocalStorage();
    this.syncCartWithServer();
  }

  calculateShipping(items: CartItem[]): number {
    const baseShipping = 10;
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    return baseShipping + (itemCount > 5 ? 5 : 0);
  }

  isItemInCart(itemId: string): boolean {
    return this.cartItems.value.some(item => item.id === itemId);
  }

  getCartItem(itemId: string): CartItem | undefined {
    return this.cartItems.value.find(item => item.id === itemId);
  }
}