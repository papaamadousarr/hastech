import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService, ShippingAddress, Order } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="checkout-container">
      <div class="checkout-header">
        <h1>Finaliser la commande</h1>
        <div class="checkout-steps">
          <div class="step active">
            <span class="step-number">1</span>
            <span class="step-label">Adresse de livraison</span>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <span class="step-label">Paiement</span>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <span class="step-label">Confirmation</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <div class="checkout-form">
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <h2>Adresse de livraison</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Prénom *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    formControlName="firstName"
                    class="form-input"
                    [class.error]="isFieldInvalid('firstName')">
                  <div *ngIf="isFieldInvalid('firstName')" class="error-message">
                    Le prénom est requis
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">Nom *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    formControlName="lastName"
                    class="form-input"
                    [class.error]="isFieldInvalid('lastName')">
                  <div *ngIf="isFieldInvalid('lastName')" class="error-message">
                    Le nom est requis
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email"
                    class="form-input"
                    [class.error]="isFieldInvalid('email')">
                  <div *ngIf="isFieldInvalid('email')" class="error-message">
                    L'email est requis et doit être valide
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">Téléphone *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    formControlName="phone"
                    class="form-input"
                    [class.error]="isFieldInvalid('phone')">
                  <div *ngIf="isFieldInvalid('phone')" class="error-message">
                    Le téléphone est requis
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="address">Adresse *</label>
                <textarea 
                  id="address" 
                  formControlName="address"
                  rows="3"
                  class="form-textarea"
                  [class.error]="isFieldInvalid('address')"
                  placeholder="Numéro et nom de rue"></textarea>
                <div *ngIf="isFieldInvalid('address')" class="error-message">
                  L'adresse est requise
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">Ville *</label>
                  <input 
                    type="text" 
                    id="city" 
                    formControlName="city"
                    class="form-input"
                    [class.error]="isFieldInvalid('city')">
                  <div *ngIf="isFieldInvalid('city')" class="error-message">
                    La ville est requise
                  </div>
                </div>

                <div class="form-group">
                  <label for="postalCode">Code postal *</label>
                  <input 
                    type="text" 
                    id="postalCode" 
                    formControlName="postalCode"
                    class="form-input"
                    [class.error]="isFieldInvalid('postalCode')">
                  <div *ngIf="isFieldInvalid('postalCode')" class="error-message">
                    Le code postal est requis
                  </div>
                </div>

                <div class="form-group">
                  <label for="country">Pays *</label>
                  <select 
                    id="country" 
                    formControlName="country"
                    class="form-select"
                    [class.error]="isFieldInvalid('country')">
                    <option value="">Sélectionner un pays</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                  <div *ngIf="isFieldInvalid('country')" class="error-message">
                    Le pays est requis
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="goBack()" class="btn-secondary">
                Retour au panier
              </button>
              <button type="submit" 
                      [disabled]="!checkoutForm.valid || isSubmitting"
                      class="btn-primary">
                {{ isSubmitting ? 'Traitement...' : 'Continuer vers le paiement' }}
              </button>
            </div>
          </form>
        </div>

        <div class="checkout-summary">
          <div class="summary-section">
            <h3>Résumé de la commande</h3>
            
            <div class="order-items">
              <div *ngFor="let item of cartItems" class="order-item">
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <div class="item-meta">
                    <span *ngIf="item.brand" class="item-brand">{{ item.brand }}</span>
                    <span *ngIf="item.oemNumber" class="item-oem">OEM: {{ item.oemNumber }}</span>
                  </div>
                </div>
                <div class="item-quantity">{{ item.quantity }}x</div>
                <div class="item-price">{{ formatPrice(item.price * item.quantity) }}</div>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-row">
                <span>Sous-total</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              
              <div class="summary-row">
                <span>TVA (20%)</span>
                <span>{{ formatPrice(tax) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Frais de livraison</span>
                <span>{{ formatPrice(shipping) }}</span>
              </div>
              
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ formatPrice(total) }}</span>
              </div>
            </div>
          </div>

          <div class="delivery-info">
            <h4>Informations de livraison</h4>
            <div class="delivery-options">
              <div class="delivery-option">
                <span class="delivery-icon">🚚</span>
                <div class="delivery-details">
                  <span class="delivery-title">Livraison standard</span>
                  <span class="delivery-time">3-5 jours ouvrables</span>
                </div>
              </div>
              <div class="delivery-option">
                <span class="delivery-icon">📦</span>
                <div class="delivery-details">
                  <span class="delivery-title">Livraison gratuite</span>
                  <span class="delivery-time">Dès 100€ d'achat</span>
                </div>
              </div>
            </div>
          </div>

          <div class="security-info">
            <div class="security-item">
              <span class="security-icon">🔒</span>
              <span>Paiement sécurisé</span>
            </div>
            <div class="security-item">
              <span class="security-icon">🔄</span>
              <span>Retour sous 30 jours</span>
            </div>
            <div class="security-item">
              <span class="security-icon">🛡️</span>
              <span>Garantie 2 ans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .checkout-header {
      margin-bottom: 2rem;
    }

    .checkout-header h1 {
      font-size: 2rem;
      color: #1f2937;
      margin-bottom: 1.5rem;
    }

    .checkout-steps {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
    }

    .step.active {
      color: #059669;
    }

    .step-number {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .step.active .step-number {
      background: #059669;
      color: white;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }

    .checkout-form {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h2 {
      font-size: 1.5rem;
      color: #1f2937;
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
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

    .form-input, .form-select, .form-textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #059669;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    }

    .form-input.error, .form-select.error, .form-textarea.error {
      border-color: #dc2626;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.75rem;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .checkout-summary {
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

    .order-items {
      margin-bottom: 1.5rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }

    .item-meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .item-quantity {
      font-weight: 600;
      color: #6b7280;
      margin: 0 1rem;
    }

    .item-price {
      font-weight: 600;
      color: #059669;
    }

    .order-summary {
      border-top: 2px solid #e5e7eb;
      padding-top: 1rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.875rem;
    }

    .summary-row.total {
      font-weight: 600;
      font-size: 1.125rem;
      color: #059669;
      border-top: 1px solid #e5e7eb;
      margin-top: 0.5rem;
      padding-top: 1rem;
    }

    .delivery-info {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.375rem;
    }

    .delivery-info h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .delivery-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .delivery-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .delivery-icon {
      font-size: 1.25rem;
    }

    .delivery-details {
      display: flex;
      flex-direction: column;
    }

    .delivery-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .delivery-time {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .security-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .security-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .security-icon {
      font-size: 1rem;
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

    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
        gap: 1rem;
      }

      .checkout-steps {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  shipping: number = 0;
  total: number = 0;
  isSubmitting: boolean = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cart$.subscribe(cart => {
        this.cartItems = cart.items;
        this.calculateTotals();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Méthodes de validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Méthodes de calcul
  calculateTotals(): void {
    this.subtotal = this.cartService.calculateSubtotal();
    this.tax = this.cartService.calculateTax();
    this.shipping = this.calculateShipping();
    this.total = this.cartService.calculateTotal();
  }

  calculateShipping(): number {
    if (this.subtotal >= 100) {
      return 0; // Livraison gratuite
    } else if (this.cartItems.length <= 3) {
      return 5.99;
    } else if (this.cartItems.length <= 10) {
      return 8.99;
    } else {
      return 12.99;
    }
  }

  // Méthodes de soumission
  onSubmit(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isSubmitting = true;
      
      const shippingAddress: ShippingAddress = this.checkoutForm.value;
      
      // Valider la commande
      const validation = this.orderService.validateOrder(this.cartItems, shippingAddress);
      
      if (!validation.isValid) {
        this.notificationService.error(
          'Erreur de validation',
          validation.errors.join(', ')
        );
        this.isSubmitting = false;
        return;
      }

      // Créer la commande
      this.orderService.createOrder(this.cartItems, shippingAddress).subscribe({
        next: (order) => {
          this.notificationService.success(
            'Commande créée',
            'Votre commande a été créée avec succès'
          );
          this.cartService.clearCart();
          this.router.navigate(['/order-confirmation', order.id]);
        },
        error: (error) => {
          this.notificationService.showApiError(error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.notificationService.warning(
        'Formulaire invalide',
        'Veuillez vérifier les informations saisies'
      );
    }
  }

  // Méthodes utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
} 