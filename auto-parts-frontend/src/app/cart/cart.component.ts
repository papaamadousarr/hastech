import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { OrderService, ShippingAddress } from '../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <h1>Mon Panier</h1>
        <div class="cart-summary">
          <span class="item-count">{{ cart?.itemCount || 0 }} article(s)</span>
          <span class="total-price">{{ formatPrice(cart?.total || 0) }}</span>
        </div>
      </div>

      <div *ngIf="!cart || cart.items.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits et ajoutez-les à votre panier</p>
        <button (click)="goToProducts()" class="btn-primary">
          Voir nos produits
        </button>
      </div>

      <div *ngIf="cart && cart.items.length > 0" class="cart-content">
        <div class="cart-items">
          <div *ngFor="let item of cart.items; trackBy: trackByItem" class="cart-item">
            <div class="item-image">
              <img [src]="item.image || 'assets/images/placeholders/product.jpg'" 
                   [alt]="item.name"
                   (error)="onImageError($event)">
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="item-meta">
                <span *ngIf="item.brand" class="item-brand">{{ item.brand }}</span>
                <span *ngIf="item.oemNumber" class="item-oem">OEM: {{ item.oemNumber }}</span>
              </div>
              <div class="item-price">{{ formatPrice(item.price) }}</div>
              <div class="item-stock" [ngClass]="{'in-stock': item.inStock, 'out-of-stock': !item.inStock}">
                {{ item.inStock ? 'En stock' : 'Rupture de stock' }}
              </div>
            </div>

            <div class="item-quantity">
              <div class="quantity-controls">
                <button (click)="updateQuantity(item.id, item.quantity - 1)" 
                        [disabled]="item.quantity <= 1"
                        class="quantity-btn">
                  -
                </button>
                <input type="number" 
                       [value]="item.quantity" 
                       (change)="onQuantityChange(item.id, $event)"
                       min="1" 
                       [max]="item.maxQuantity || 999"
                       class="quantity-input">
                <button (click)="updateQuantity(item.id, item.quantity + 1)" 
                        [disabled]="item.quantity >= (item.maxQuantity || 999)"
                        class="quantity-btn">
                  +
                </button>
              </div>
              <div class="item-total">{{ formatPrice(item.price * item.quantity) }}</div>
            </div>

            <button (click)="removeItem(item.id)" class="remove-btn" title="Retirer du panier">
              ✕
            </button>
          </div>
        </div>

        <div class="cart-summary-panel">
          <div class="summary-section">
            <h3>Résumé de la commande</h3>
            
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ formatPrice(cart.total) }}</span>
            </div>
            
            <div class="summary-row">
              <span>TVA (20%)</span>
              <span>{{ formatPrice(calculateTax()) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Frais de livraison</span>
              <span>{{ formatPrice(calculateShipping()) }}</span>
            </div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatPrice(calculateTotal()) }}</span>
            </div>
          </div>

          <div class="cart-actions">
            <button (click)="clearCart()" class="btn-secondary">
              Vider le panier
            </button>
            <button (click)="proceedToCheckout()" 
                    [disabled]="!canProceedToCheckout()"
                    class="btn-primary checkout-btn">
              Passer la commande
            </button>
          </div>

          <div class="cart-benefits">
            <div class="benefit">
              <span class="benefit-icon">🚚</span>
              <span>Livraison gratuite dès 100€</span>
            </div>
            <div class="benefit">
              <span class="benefit-icon">🔄</span>
              <span>Retour sous 30 jours</span>
            </div>
            <div class="benefit">
              <span class="benefit-icon">🔒</span>
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .cart-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .cart-summary {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .item-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .total-price {
      font-size: 1.25rem;
      font-weight: 600;
      color: #059669;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-cart-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-cart h2 {
      font-size: 1.5rem;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .empty-cart p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      align-items: center;
    }

    .item-image img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 0.25rem;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-name {
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      font-size: 1rem;
    }

    .item-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .item-price {
      font-weight: 600;
      color: #059669;
      font-size: 1.125rem;
    }

    .item-stock {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .item-stock.in-stock {
      color: #059669;
    }

    .item-stock.out-of-stock {
      color: #dc2626;
    }

    .item-quantity {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .quantity-btn {
      background: #f3f4f6;
      border: none;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }

    .quantity-btn:hover:not(:disabled) {
      background: #e5e7eb;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-input {
      width: 60px;
      text-align: center;
      border: none;
      padding: 0.5rem;
      font-weight: 600;
    }

    .quantity-input:focus {
      outline: none;
    }

    .item-total {
      font-weight: 600;
      color: #1f2937;
      font-size: 1.125rem;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #dc2626;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }

    .remove-btn:hover {
      background: #fef2f2;
    }

    .cart-summary-panel {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .summary-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      color: #1f2937;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .summary-row.total {
      border-bottom: none;
      font-weight: 600;
      font-size: 1.125rem;
      color: #059669;
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 2px solid #e5e7eb;
    }

    .cart-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .btn-primary {
      background: #059669;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #047857;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .checkout-btn {
      font-size: 1.125rem;
      padding: 1rem 1.5rem;
    }

    .cart-benefits {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .benefit-icon {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 0.75rem;
      }

      .item-quantity {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .remove-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
      }
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart: any = null;
  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cart$.subscribe(cart => {
        this.cart = cart;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Méthodes de gestion du panier
  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onQuantityChange(productId: string, event: any): void {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      this.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  // Méthodes de calcul
  calculateTax(): number {
    return this.cartService.calculateTax();
  }

  calculateShipping(): number {
    const subtotal = this.cartService.calculateSubtotal();
    if (subtotal >= 100) {
      return 0; // Livraison gratuite
    } else if (this.cart?.itemCount <= 3) {
      return 5.99;
    } else if (this.cart?.itemCount <= 10) {
      return 8.99;
    } else {
      return 12.99;
    }
  }

  calculateTotal(): number {
    return this.cartService.calculateTotal();
  }

  // Méthodes utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  trackByItem(index: number, item: CartItem): string {
    return item.id;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholders/product.jpg';
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  canProceedToCheckout(): boolean {
    return this.cart && this.cart.items.length > 0 && 
           this.cart.items.every((item: CartItem) => item.inStock);
  }

  proceedToCheckout(): void {
    if (this.canProceedToCheckout()) {
      this.router.navigate(['/checkout']);
    } else {
      this.notificationService.warning(
        'Panier invalide',
        'Veuillez vérifier que tous les articles sont en stock'
      );
    }
  }
}
