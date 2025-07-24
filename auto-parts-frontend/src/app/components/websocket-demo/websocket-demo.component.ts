import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService, OrderStatusUpdate, InventoryUpdate, PriceUpdate, ChatMessage } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-websocket-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="websocket-demo">
      <h2>WebSocket Real-time Demo</h2>
      
      <!-- Connection Status -->
      <div class="connection-status" [class.connected]="isConnected">
        <span class="status-indicator"></span>
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </div>

      <!-- Connection Controls -->
      <div class="controls">
        <button (click)="connect()" [disabled]="isConnected">Connect</button>
        <button (click)="disconnect()" [disabled]="!isConnected">Disconnect</button>
        <button (click)="ping()" [disabled]="!isConnected">Ping</button>
      </div>

      <!-- Real-time Updates -->
      <div class="updates">
        <div class="update-section">
          <h3>Order Status Updates</h3>
          <div class="update-list">
            <div *ngFor="let update of orderUpdates" class="update-item">
              <strong>Order {{ update.orderId }}</strong>: {{ update.status }}
              <small>{{ update.message }}</small>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3>Inventory Updates</h3>
          <div class="update-list">
            <div *ngFor="let update of inventoryUpdates" class="update-item">
              <strong>{{ update.productName }}</strong>: 
              Stock changed from {{ update.oldStock }} to {{ update.newStock }}
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3>Price Updates</h3>
          <div class="update-list">
            <div *ngFor="let update of priceUpdates" class="update-item">
              <strong>{{ update.productName }}</strong>: 
              Price changed from €{{ update.oldPrice }} to €{{ update.newPrice }}
              <span *ngIf="update.discount" class="discount">({{ update.discount }}% off)</span>
            </div>
          </div>
        </div>

        <div class="update-section">
          <h3>Chat Messages</h3>
          <div class="chat-container">
            <div class="chat-messages">
              <div *ngFor="let message of chatMessages" class="chat-message" [class.admin]="message.isAdmin">
                <div class="message-header">
                  <strong>{{ message.senderName }}</strong>
                  <small>{{ message.timestamp | date:'short' }}</small>
                </div>
                <div class="message-content">{{ message.message }}</div>
              </div>
            </div>
            <div class="chat-input">
              <input #chatInput type="text" placeholder="Type a message..." (keyup.enter)="sendChatMessage(chatInput.value); chatInput.value = ''">
              <button (click)="sendChatMessage(chatInput.value); chatInput.value = ''">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .websocket-demo {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding: 10px;
      border-radius: 5px;
      background-color: #f5f5f5;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #ccc;
    }

    .connection-status.connected .status-indicator {
      background-color: #4caf50;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .controls button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }

    .controls button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .updates {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .update-section {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
    }

    .update-section h3 {
      margin-top: 0;
      color: #333;
    }

    .update-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .update-item {
      padding: 8px;
      margin-bottom: 8px;
      background-color: #f9f9f9;
      border-radius: 4px;
      border-left: 3px solid #007bff;
    }

    .update-item small {
      display: block;
      color: #666;
      margin-top: 4px;
    }

    .discount {
      color: #e74c3c;
      font-weight: bold;
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 300px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
    }

    .chat-message {
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 4px;
      background-color: #f0f0f0;
    }

    .chat-message.admin {
      background-color: #e3f2fd;
      border-left: 3px solid #2196f3;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .message-content {
      color: #333;
    }

    .chat-input {
      display: flex;
      gap: 10px;
    }

    .chat-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .chat-input button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
  `]
})
export class WebSocketDemoComponent implements OnInit, OnDestroy {
  isConnected = false;
  orderUpdates: OrderStatusUpdate[] = [];
  inventoryUpdates: InventoryUpdate[] = [];
  priceUpdates: PriceUpdate[] = [];
  chatMessages: ChatMessage[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Subscribe to connection status
    this.subscriptions.push(
      this.webSocketService.connectionStatus$.subscribe(
        status => this.isConnected = status
      )
    );

    // Subscribe to order updates
    this.subscriptions.push(
      this.webSocketService.subscribeToOrderUpdates().subscribe(
        update => {
          this.orderUpdates.unshift(update);
          if (this.orderUpdates.length > 10) {
            this.orderUpdates.pop();
          }
        }
      )
    );

    // Subscribe to inventory updates
    this.subscriptions.push(
      this.webSocketService.subscribeToInventoryUpdates().subscribe(
        update => {
          this.inventoryUpdates.unshift(update);
          if (this.inventoryUpdates.length > 10) {
            this.inventoryUpdates.pop();
          }
        }
      )
    );

    // Subscribe to price updates
    this.subscriptions.push(
      this.webSocketService.subscribeToPriceUpdates().subscribe(
        update => {
          this.priceUpdates.unshift(update);
          if (this.priceUpdates.length > 10) {
            this.priceUpdates.pop();
          }
        }
      )
    );

    // Subscribe to chat messages
    this.subscriptions.push(
      this.webSocketService.subscribeToChatMessages().subscribe(
        message => {
          this.chatMessages.push(message);
          if (this.chatMessages.length > 50) {
            this.chatMessages.shift();
          }
        }
      )
    );

    // Auto-connect on component initialization
    this.connect();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.webSocketService.disconnect();
  }

  connect(): void {
    this.webSocketService.connect('demo-user', 'customer');
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }

  ping(): void {
    this.webSocketService.ping();
  }

  sendChatMessage(message: string): void {
    if (message.trim()) {
      this.webSocketService.sendChatMessage(message, false);
    }
  }
} 