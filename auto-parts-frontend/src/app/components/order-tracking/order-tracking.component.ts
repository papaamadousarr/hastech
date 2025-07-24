import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from rxjs/operators';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-order-tracking',
  template: `
    <div class="order-tracking-container" *ngIf="order">
      <!-- Order Header -->
      <div class="order-header">
        <div class="order-info">
          <h1>Order #{{ order.orderNumber }}</h1>
          <p class="order-date">Placed on {{ order.createdAt | date:'medium'}}</p>
          <p class="order-total">Total: {{ order.total | currency }}</p>
        </div>
        <div class="order-status-badge [ngClass]="order.status">
          {{ order.status | titlecase }}
        </div>
      </div>

      <!-- Order Timeline -->
      <div class="timeline-container">
        <h2>Order Progress</h2>
        <div class="timeline">
          <div 
            *ngFor="let step of timelineSteps; let i = index"
            class="timeline-step"
            [ngClass]="[object Object]     completed: isStepCompleted(step.status),
         current': isCurrentStep(step.status),
              pending: !isStepCompleted(step.status) && !isCurrentStep(step.status)
            }"
          >
            <div class="step-icon>
              <i [class]="step.icon></i>
            </div>
            <div class="step-content>
              <h3>[object Object][object Object] step.title }}</h3>
              <p>{{ step.description }}</p>
              <span class="step-date" *ngIf="getStepDate(step.status)>             [object Object]{ getStepDate(step.status) | date:'short }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="order-details">
        <div class="details-section">
          <h3>Order Items</h3>
          <div class="items-list">
            <div 
              *ngFor=let item of order.items" 
              class="order-item"
            >
              <div class="item-image>
                <img [src]=item.image [alt]="item.name">
              </div>
              <div class="item-details>
                <h4>[object Object][object Object]item.name }}</h4
                <p class=item-sku>SKU:[object Object]{ item.sku }}</p>
                <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                <p class="item-price">{{ item.price | currency }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="details-section">
          <h3Shipping Address</h3>
          <div class="address-card">
            <p><strong>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</strong></p>
            <p>{{ order.shippingAddress.address }}</p>
            <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
            <p>{{ order.shippingAddress.country }}</p>
            <p>Phone: {{ order.shippingAddress.phone }}</p>
            <p>Email: {{ order.shippingAddress.email }}</p>
          </div>
        </div>

        <div class="details-section">
          <h3>Payment Information</h3>
          <div class="payment-card">
            <p><strong>Payment Method:</strong> {{ order.paymentMethod | titlecase }}</p>
            <p><strong>Payment Status:</strong> 
              <span class=payment-status[ngClass]="order.paymentStatus>                {{ order.paymentStatus | titlecase }}
              </span>
            </p>
          </div>
        </div>

        <div class="details-section">
          <h3>Order Summary</h3>
          <div class="summary-card">
            <div class="summary-row>             <span>Subtotal:</span>
              <span>{{ order.subtotal | currency }}</span>
            </div>
            <div class="summary-row>             <span>Shipping:</span>
              <span>{{ order.shippingCost | currency }}</span>
            </div>
            <div class="summary-row>             <span>Tax:</span>
              <span>{{ order.tax | currency }}</span>
            </div>
            <div class=summary-row total>             <span>Total:</span>
              <span>{{ order.total | currency }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="order-actions>     <button class="btn btn-outline" (click)=downloadInvoice()>
          <i class="fas fa-download"></i>
          Download Invoice
        </button>
        <button class="btn btn-outline (click)="contactSupport()">
          <i class="fas fa-headset"></i>
          Contact Support
        </button>
        <button class="btn btn-primary(click)="reorder()" *ngIf="order.status === 'delivered'">
          <i class="fas fa-redo"></i>
          Reorder
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div class=loading-container" *ngIf=loading">
      <div class="loading-spinner></div>
      <p>Loading order details...</p>
    </div>

    <!-- Error State -->
    <div class="error-container" *ngIf="error">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Error Loading Order</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" (click)="loadOrder()">
        Try Again
      </button>
    </div>
  `,
  styleUrls: ['./order-tracking.component.css']
})export class OrderTrackingComponent implements OnInit, OnDestroy  @Input() orderId?: string;
  
  private destroy$ = new Subject<void>();
  
  order: any;
  loading = false;
  error: string | null = null;

  timelineSteps = [
   [object Object]  status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been received and is being processed',
      icon: fas fa-shopping-cart'
    },
   [object Object]status: confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      icon: 'fas fa-check-circle'
    },
   [object Object]
      status: 'shipped',
      title:Order Shipped',
      description: 'Your order has been shipped and is on its way',
      icon: 'fas fa-shipping-fast'
    },
   [object Object]      status: delivered',
      title: 'Order Delivered',
      description: 'Your order has been delivered successfully',
      icon: fas fa-box-open'
    }
  ];

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.orderId) [object Object]      this.orderId = this.route.snapshot.paramMap.get(id') || undefined;
    }
    
    if (this.orderId)[object Object]    this.loadOrder();
    }
  }

  ngOnDestroy() [object Object]    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrder() {
    if (!this.orderId) return;

    this.loading = true;
    this.error = null;

    this.orderService.getOrder(this.orderId).subscribe(
      order => {
        this.order = order;
        this.loading = false;
      },
      error => {
        this.error = 'Failed to load order details';
        this.loading = false;
        this.notificationService.show('Error', this.error, error');
      }
    );
  }

  isStepCompleted(status: string): boolean [object Object] const statusOrder = ['pending', 'confirmed, ipped',delivered'];
    const currentIndex = statusOrder.indexOf(this.order?.status || ');   const stepIndex = statusOrder.indexOf(status);
    return stepIndex <= currentIndex;
  }

  isCurrentStep(status: string): boolean[object Object] return this.order?.status === status;
  }

  getStepDate(status: string): Date | null {
    // This would be implemented based on your order tracking data
    // For now, returning null as placeholder
    return null;
  }

  downloadInvoice() {
    // Implementation for downloading invoice
    this.notificationService.show('Info',Invoice download feature coming soon, );
  }

  contactSupport() {
    // Implementation for contacting support
    this.notificationService.show('Info', 'Support contact feature coming soon,info);
  }

  reorder() {
    // Implementation for reordering
    this.notificationService.show('Info', 'Reorder feature coming soon, 