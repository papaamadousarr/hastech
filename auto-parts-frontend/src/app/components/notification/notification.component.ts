import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  template: `
    <div class="notification-container" *ngIf="notifications.length > 0">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByNotification"
        class="notification"
        [ngClass]="notification.type"
        [@notificationAnimation]="notification.state"
        (click)="dismissNotification(notification.id)"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <i [class]="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-text">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button 
            class="notification-close"
            (click)="dismissNotification(notification.id)"
            aria-label="Close notification"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notification-progress" *ngIf="notification.autoDismiss">
          <div class="progress-bar" [style.width.%]="notification.progress"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('notificationAnimation',
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      transition('void => in', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }),
        animate(300ms ease-out)
      ),
      transition('in => out',
        animate('300ms ease-in')
      )
    )
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dismissNotification(id: string) {
    this.notificationService.dismiss(id);
  }

  trackByNotification(index: number, notification: Notification): string {
    return notification.id;
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-bell';
    }
  }
} 