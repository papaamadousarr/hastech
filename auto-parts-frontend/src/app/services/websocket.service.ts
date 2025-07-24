import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WebSocketMessage {
  type: string;
  data: any;
  userId?: string;
  target?: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  message: string;
  timestamp: Date;
}

export interface InventoryUpdate {
  productId: string;
  productName: string;
  newStock: number;
  oldStock: number;
  message: string;
  timestamp: Date;
}

export interface PriceUpdate {
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  discount?: number;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  // Connection status
  private connectionStatus = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatus.asObservable();

  // Message subjects
  private orderStatusSubject = new Subject<OrderStatusUpdate>();
  private inventoryUpdateSubject = new Subject<InventoryUpdate>();
  private priceUpdateSubject = new Subject<PriceUpdate>();
  private chatMessageSubject = new Subject<ChatMessage>();
  private generalMessageSubject = new Subject<WebSocketMessage>();

  // Public observables
  public orderStatusUpdates$ = this.orderStatusSubject.asObservable();
  public inventoryUpdates$ = this.inventoryUpdateSubject.asObservable();
  public priceUpdates$ = this.priceUpdateSubject.asObservable();
  public chatMessages$ = this.chatMessageSubject.asObservable();
  public generalMessages$ = this.generalMessageSubject.asObservable();

  constructor() {
    // Auto-reconnect on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.isConnected()) {
        this.connect();
      }
    });
  }

  /**
   * Connect to WebSocket server
   */
  public connect(userId?: string, userType: 'customer' | 'admin' | 'guest' = 'guest'): void {
    if (this.isConnecting || this.isConnected()) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = environment.apiUrl.replace('/api', '').replace('http', 'ws') + '/ws';
    
    // Add query parameters
    const url = new URL(wsUrl);
    if (userId) {
      url.searchParams.set('userId', userId);
    }
    url.searchParams.set('userType', userType);

    try {
      this.socket = new WebSocket(url.toString());
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionStatus.next(false);
    this.isConnecting = false;
  }

  /**
   * Send a message to the WebSocket server
   */
  public sendMessage(message: WebSocketMessage): void {
    if (this.isConnected()) {
      this.socket!.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  }

  /**
   * Send a ping message
   */
  public ping(): void {
    this.sendMessage({ type: 'ping', data: null });
  }

  /**
   * Send order status request
   */
  public requestOrderStatus(orderId: string): void {
    this.sendMessage({
      type: 'order_status',
      data: { orderId }
    });
  }

  /**
   * Send chat message
   */
  public sendChatMessage(message: string, isAdmin: boolean = false): void {
    this.sendMessage({
      type: 'chat_message',
      data: {
        message,
        isAdmin,
        timestamp: new Date()
      }
    });
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): boolean {
    return this.connectionStatus.value;
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.connectionStatus.next(true);
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      // Send initial ping
      this.ping();
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.connectionStatus.next(false);
      this.isConnecting = false;
      
      if (!event.wasClean) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus.next(false);
      this.isConnecting = false;
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'pong':
        // Handle pong response
        console.log('Received pong');
        break;

      case 'order_status_update':
        this.orderStatusSubject.next(message.data as OrderStatusUpdate);
        break;

      case 'inventory_update':
        this.inventoryUpdateSubject.next(message.data as InventoryUpdate);
        break;

      case 'price_update':
        this.priceUpdateSubject.next(message.data as PriceUpdate);
        break;

      case 'chat_message':
        this.chatMessageSubject.next(message.data as ChatMessage);
        break;

      default:
        // Handle unknown message types
        this.generalMessageSubject.next(message);
        console.log('Received unknown message type:', message.type);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Subscribe to specific message types
   */
  public subscribeToOrderUpdates(): Observable<OrderStatusUpdate> {
    return this.orderStatusUpdates$;
  }

  public subscribeToInventoryUpdates(): Observable<InventoryUpdate> {
    return this.inventoryUpdates$;
  }

  public subscribeToPriceUpdates(): Observable<PriceUpdate> {
    return this.priceUpdates$;
  }

  public subscribeToChatMessages(): Observable<ChatMessage> {
    return this.chatMessages$;
  }

  public subscribeToGeneralMessages(): Observable<WebSocketMessage> {
    return this.generalMessages$;
  }

  /**
   * Cleanup on service destruction
   */
  ngOnDestroy(): void {
    this.disconnect();
  }
} 