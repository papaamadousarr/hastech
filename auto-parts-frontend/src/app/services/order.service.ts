import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CartItem } from './cart.service';
import { NotificationService } from './notification.service';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderSummary {
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  // Créer une commande
  createOrder(cartItems: CartItem[], shippingAddress: ShippingAddress): Observable<Order> {
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    }));

    const orderSummary = this.calculateOrderSummary(orderItems);
    
    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      items: orderItems,
      subtotal: orderSummary.subtotal,
      tax: orderSummary.tax,
      shipping: orderSummary.shipping,
      total: orderSummary.total,
      shippingAddress,
      status: 'pending'
    };

    return this.http.post<Order>(`${this.apiUrl}/orders`, order).pipe(
      map(response => {
        this.notificationService.success(
          'Commande créée',
          'Votre commande a été créée avec succès'
        );
        return response;
      }),
      catchError(error => {
        this.notificationService.showApiError(error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les commandes d'un utilisateur
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      catchError(error => {
        this.notificationService.showApiError(error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer une commande spécifique
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`).pipe(
      catchError(error => {
        this.notificationService.showApiError(error);
        return throwError(() => error);
      })
    );
  }

  // Annuler une commande
  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/cancel`, {}).pipe(
      map(response => {
        this.notificationService.success(
          'Commande annulée',
          'Votre commande a été annulée'
        );
        return response;
      }),
      catchError(error => {
        this.notificationService.showApiError(error);
        return throwError(() => error);
      })
    );
  }

  // Calculer le résumé de la commande
  calculateOrderSummary(items: OrderItem[]): OrderSummary {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.20; // 20% TVA
    const shipping = this.calculateShipping(items);
    const total = subtotal + tax + shipping;

    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      tax,
      shipping,
      total
    };
  }

  // Calculer les frais de livraison
  private calculateShipping(items: OrderItem[]): number {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + item.total, 0);

    // Logique de calcul des frais de livraison
    if (totalValue >= 100) {
      return 0; // Livraison gratuite pour les commandes de plus de 100€
    } else if (totalItems <= 3) {
      return 5.99; // Frais de base
    } else if (totalItems <= 10) {
      return 8.99; // Frais pour commandes moyennes
    } else {
      return 12.99; // Frais pour grosses commandes
    }
  }

  // Valider une adresse de livraison
  validateShippingAddress(address: ShippingAddress): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.firstName?.trim()) errors.push('Le prénom est requis');
    if (!address.lastName?.trim()) errors.push('Le nom est requis');
    if (!address.email?.trim()) errors.push('L\'email est requis');
    if (!this.isValidEmail(address.email)) errors.push('L\'email n\'est pas valide');
    if (!address.phone?.trim()) errors.push('Le téléphone est requis');
    if (!address.address?.trim()) errors.push('L\'adresse est requise');
    if (!address.city?.trim()) errors.push('La ville est requise');
    if (!address.postalCode?.trim()) errors.push('Le code postal est requis');
    if (!address.country?.trim()) errors.push('Le pays est requis');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Valider une commande
  validateOrder(items: CartItem[], shippingAddress: ShippingAddress): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Valider les articles
    if (!items || items.length === 0) {
      errors.push('Le panier est vide');
    } else {
      items.forEach((item, index) => {
        if (!item.name) errors.push(`Article ${index + 1}: Nom manquant`);
        if (item.price <= 0) errors.push(`Article ${index + 1}: Prix invalide`);
        if (item.quantity <= 0) errors.push(`Article ${index + 1}: Quantité invalide`);
        if (!item.inStock) errors.push(`Article ${index + 1}: En rupture de stock`);
      });
    }

    // Valider l'adresse
    const addressValidation = this.validateShippingAddress(shippingAddress);
    if (!addressValidation.isValid) {
      errors.push(...addressValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Méthodes utilitaires
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Formater le prix
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  // Obtenir le statut en français
  getStatusLabel(status: Order['status']): string {
    const statusLabels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return statusLabels[status] || status;
  }
} 