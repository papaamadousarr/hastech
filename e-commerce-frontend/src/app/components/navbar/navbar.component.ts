import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
  
})

export class NavbarComponent {
  cartItemCount: number = 0;
  isLoggedIn: boolean = false; // Propriété pour suivre l'état de la connexion
  router: any;
  constructor(private authService: AuthService,private cartService: CartService) {}

  ngOnInit(): void {
     // Vérifiez l'état de connexion via le service d'authentification
     this.isLoggedIn = this.authService.isAuthenticated();
     // Mettre à jour le nombre d'articles dans le panier dès que le composant est initialisé
     this.cartItemCount = this.cartService.getCartItemCount();

  }

   // Méthode pour rafraîchir le nombre d'articles du panier
   updateCartCount(): void {
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  logout() {
    // Appelez la méthode du service pour déconnecter l'utilisateur
    this.authService.logout();
    // Mettez à jour l'état de l'interface utilisateur pour afficher "Signin" après la déconnexion
    this.isLoggedIn = false;
  }
}
