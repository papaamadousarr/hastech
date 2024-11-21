import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'; // Import du service
import { AuthService } from '../../services/auth.service'; // Import du service

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,NavbarComponent],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  userId: string | null = 'a477d1767bd4df2fec370d5c'; // Vous pouvez récupérer l'ID utilisateur depuis un service d'authentification ou un localStorage.

  constructor(private cartService: CartService,private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotal();
  }
  
  loadCartItems(): void {
    const savedCart = localStorage.getItem('tempCart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    } else {
      this.cartItems = []; // Panier vide par défaut
    }
  }  

  // Calculer le total du panier
  calculateTotal(): void {
    this.total = this.cartItems.reduce((accum, item) => accum + (item.price * item.quantity), 0);
  }

  // Supprimer un article du panier
  removeFromCart(productId: string): void {
    if (this.userId) {
      this.cartService.removeFromCart(productId, this.userId).subscribe(
        (response) => {
          console.log('Produit supprimé avec succès', response);
          this.loadCartItems(); // Recharger les articles du panier après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'article', error);
        }
      );
    }
  }

  // Passer une commande
  payment(): void {
    console.log(this.authService.isAuthenticated());
    
    if (this.authService.isAuthenticated()) {
     // Rediriger vers la page de paiement et passer les données nécessaires
     this.router.navigate(['/placeorder'], {
      state: { cartItems: this.cartItems, total: this.total }
     });
    } else {
      // Si l'utilisateur n'est pas authentifié, rediriger vers la connexion
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/placeorder' }
      });
    }
  }
   // Passer une commande
   placeOrder(): void {
    console.log(this.authService.isAuthenticated());
    
    if (this.authService.isAuthenticated()) {
      // Si l'utilisateur est authentifié, continuer vers la caisse
      const orderData = {
        userId: this.userId,
        items: this.cartItems, // Vous pouvez ajuster la structure des données pour correspondre à ce qui est attendu par votre API
        total: this.total,
      };
      this.cartService.placeOrder(orderData).subscribe(
        (response) => {
          console.log('Commande passée avec succès', response);
          this.router.navigate(['/placeorder']); // Rediriger vers une page de confirmation
        },
        (error) => {
          console.error('Erreur lors du passage de la commande', error);
        }
      );
    } else {
      // Si l'utilisateur n'est pas authentifié, rediriger vers la connexion
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/placeorder' }
      });
    }
  }

  // Mettre à jour la quantité d'un produit
  onQuantityChange(productId: string, event: Event): void {

    console.log(productId, event);
    
    // On vérifie si l'événement est bien un élément HTMLInputElement
    const input = event.target as HTMLInputElement;
  
    // Si l'élément est un input et a une valeur valide, on continue
    if (input && !isNaN(Number(input.value)) && Number(input.value) > 0) {
      const quantity = Number(input.value); // Convertir la valeur en nombre
  
      if (this.authService.isAuthenticated() && this.userId) {
        // L'utilisateur est authentifié, on met à jour via le service
        this.cartService.updateQuantity(productId, quantity, this.userId).subscribe(
          (response) => {
            console.log('Quantité mise à jour', response);
            this.loadCartItems(); // Recharger les articles du panier après mise à jour
            this.calculateTotal(); // Calculer le total du panier

          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la quantité', error);
          }
        );
      } else {
        // L'utilisateur n'est pas authentifié, on met à jour le panier stocké localement
        const savedCart = localStorage.getItem('tempCart');
        if (savedCart) {
          let cartItems = JSON.parse(savedCart);
  
          // Rechercher le produit et mettre à jour la quantité
          const itemIndex = cartItems.findIndex((item: any) => item.productId === productId);
          if (itemIndex !== -1) {
            cartItems[itemIndex].quantity = quantity;
  
            // Enregistrer les modifications dans le localStorage
            localStorage.setItem('tempCart', JSON.stringify(cartItems));
            console.log('Quantité mise à jour dans le localStorage');
            this.loadCartItems(); // Recharger les articles du panier après mise à jour
            this.calculateTotal(); // Calculer le total du panier
  
            // Recharger les articles du panier
            this.cartItems = cartItems;
          } else {
            console.error('Produit non trouvé dans le panier');
          }
        } else {
          console.error('Aucun panier trouvé dans le localStorage');
        }
      }
    }
  }
   
}
