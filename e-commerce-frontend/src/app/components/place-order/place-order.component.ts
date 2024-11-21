import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Shipping } from '../../models/shipping.model'
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  // Assurez-vous que FormsModule est importé ici
    NavbarComponent
  ]
})
export class PlaceOrderComponent implements OnInit {
  currentStep: number = 1;  // Suivi de l'étape actuelle

  // Données de la commande
  userId: string | null = null;
  cartItems: any[] = [];
  total: number = 0;
  paymentMethod: string = 'creditCard';  // Valeur par défaut pour le paiement
  paymentDetails: any = {};  // Détails du paiement

  // Informations de livraison
  shippingInfo: Shipping = {
    house_name: '',
    street_name: '',
    city_name: '',
    pincode: '',
    shipping_method:''
  };

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { cartItems: any[], total: number };

    // Initialisez les données du panier à partir de l'état passé par la page précédente
    if (state) {
      this.cartItems = state.cartItems || [];
      this.total = state.total || 0;
    }
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadCartItems();
  }

  // Charger les articles du panier et calculer le total
  loadCartItems(): void {
    if (this.userId) {
      this.cartService.getCartItems(this.userId).subscribe((items) => {
        this.cartItems = items;
        this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      });
    }
  }

  // Passer à l'étape suivante
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  // Passer à l'étape précédente
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Passer la commande
  placeOrder(): void {
    if (this.authService.isAuthenticated()) {
      const orderData = {
        userId: this.userId,
        items: this.cartItems,
        total: this.total,
        paymentInfo: {
          method: this.paymentMethod,
          amount: this.total,
          status: 'paid'  // Paiement effectué
        },
        shipping: this.shippingInfo,  // Intégration des infos de livraison
      };

      this.cartService.placeOrder(orderData).subscribe(
        (response) => {
          console.log('Commande passée avec succès', response);
          this.router.navigate(['/order-confirmation']);  // Redirige vers la page de confirmation de commande
        },
        (error) => {
          console.error('Erreur lors du passage de la commande', error);
        }
      );
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/placeorder' }
      });
    }
  }
}
