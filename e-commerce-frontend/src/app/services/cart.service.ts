import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart'; // Remplacez par l'URL de votre API

  private cartSubject = new BehaviorSubject<any[]>([]);
  public cart$ = this.cartSubject.asObservable();

  private cartItemCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  // Récupérer les articles du panier pour un utilisateur donné
  getCartItems(userId: string | null): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items?userID=${userId}`);
  }

  addToCart(productId: string, quantity: number, userId: string | null): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addtocart`, {
      productId,
      quantity,
      userId,
    }).pipe(
      // Mettre à jour le panier localement après l'ajout
      tap(() => 
      {
        this.updateCart(userId);  // Met à jour le panier
        this.updateCartItemCount();  // Met à jour le nombre d'articles
      }
      )
    );
  }
  
 // Mettre à jour le nombre d'articles dans le panier
 private updateCartItemCount(): void {
  const savedCart = localStorage.getItem('tempCart');
  console.log(savedCart);
  
  let itemCount = 0;

  if (savedCart) {
    const cartItems = JSON.parse(savedCart);
    itemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  this.cartItemCountSubject.next(itemCount);  // Met à jour le nombre d'articles dans le panier
}
   // Mettre à jour le panier après une modification
   private updateCart(userId: string | null): void {
    this.getCartItems(userId).subscribe((items) => {
      this.cartSubject.next(items);
    });
  }

  // Supprimer un produit du panier
  removeFromCart(productId: string, userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/removefromcart?id=${productId}&userID=${userId}`);
  }

  // Passer une commande
  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/placeOrder`, orderData);
  } 
  
  // Mettre à jour la quantité d'un produit dans le panier
  updateQuantity(productId: string, quantity: number, userId: string): Observable<any> {
    const body = { productId, quantity, userId };
    return this.http.put<any>(`${this.apiUrl}/updateQuantity`, body);
  }

    // Récupérer le nombre d'articles dans le panier
  getCartItemCount(): number {
    const savedCart = localStorage.getItem('tempCart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      return cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
    }
    return 0;
  }

   // Récupérer l'observable pour le cartItemCount
   getCartItemCountObservable() {
    return this.cartItemCountSubject.asObservable();
  }



  // Autres méthodes peuvent être ajoutées ici
}
