import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // en millisecondes, null pour persistant
  timestamp: Date;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  constructor() {
    // Nettoyer les notifications expirées périodiquement
    setInterval(() => {
      this.cleanExpiredNotifications();
    }, 1000); // Vérifier toutes les secondes
  }

  // Méthodes principales
  show(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date()
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, fullNotification]);

    // Auto-suppression si durée spécifiée
    if (fullNotification.duration) {
      setTimeout(() => {
        this.remove(id);
      }, fullNotification.duration);
    }

    return id;
  }

  success(title: string, message: string, duration: number = 5000): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration: number = 8000): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration
    });
  }

  warning(title: string, message: string, duration: number = 6000): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration: number = 4000): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  // Méthodes de gestion
  remove(id: string): void {
    const currentNotifications = this.notifications.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(filteredNotifications);
  }

  clear(): void {
    this.notifications.next([]);
  }

  clearByType(type: Notification['type']): void {
    const currentNotifications = this.notifications.value;
    const filteredNotifications = currentNotifications.filter(n => n.type !== type);
    this.notifications.next(filteredNotifications);
  }

  // Méthodes utilitaires
  getNotifications(): Notification[] {
    return this.notifications.value;
  }

  getNotificationCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.length);
      });
    });
  }

  getNotificationCountByType(type: Notification['type']): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const count = notifications.filter(n => n.type === type).length;
        observer.next(count);
      });
    });
  }

  // Méthodes privées
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private cleanExpiredNotifications(): void {
    const currentNotifications = this.notifications.value;
    const now = new Date();
    const validNotifications = currentNotifications.filter(notification => {
      if (!notification.duration) return true; // Notifications persistantes
      
      const expiryTime = new Date(notification.timestamp.getTime() + notification.duration);
      return now < expiryTime;
    });

    if (validNotifications.length !== currentNotifications.length) {
      this.notifications.next(validNotifications);
    }
  }

  // Méthodes spécialisées pour l'e-commerce
  showProductAdded(productName: string): string {
    return this.success(
      'Produit ajouté',
      `${productName} a été ajouté au panier`,
      3000
    );
  }

  showProductRemoved(productName: string): string {
    return this.info(
      'Produit retiré',
      `${productName} a été retiré du panier`,
      3000
    );
  }

  showCartUpdated(): string {
    return this.success(
      'Panier mis à jour',
      'Votre panier a été mis à jour',
      2000
    );
  }

  showNetworkError(): string {
    return this.error(
      'Erreur de connexion',
      'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
      8000
    );
  }

  showApiError(error: any): string {
    const message = error?.message || error?.error || 'Une erreur est survenue';
    return this.error(
      'Erreur serveur',
      message,
      8000
    );
  }

  showSuccess(message: string): string {
    return this.success(
      'Succès',
      message,
      3000
    );
  }

  showLoadingError(resource: string): string {
    return this.error(
      'Erreur de chargement',
      `Impossible de charger ${resource}. Veuillez réessayer.`,
      6000
    );
  }
} 