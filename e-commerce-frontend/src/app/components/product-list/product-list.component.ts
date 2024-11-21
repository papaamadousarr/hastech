import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppComponent } from '../../app.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    AppComponent,
    CommonModule,
    NavbarComponent,
    FormsModule // Ensure FormsModule is imported here
  ]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isLoading: boolean = false;

  constructor(private productService: ProductService,private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    );
  }
  generateTempUserId(): string {
    return this.generateObjectId();
  }
  
  generateObjectId(): string {
    // Créer une chaîne hexadécimale valide de 24 caractères pour simuler un ObjectID
    let hexChars = "0123456789abcdef";
    let objectId = "";
    for (let i = 0; i < 24; i++) {
      objectId += hexChars[Math.floor(Math.random() * 16)];
    }
    return objectId;
  }
  
  addToCart(product: any): void {
    let userId = this.authService.getUserId(); // Vérifier si l'utilisateur est connecté
    
    if (!product.Product_ID || !this.isValidObjectId(product.Product_ID)) {
      console.error('L\'ID du produit est invalide');
      return;
    }
  
    const payload = {
      productId: product.Product_ID,
      product_name: product.product_name,
      quantity: 1,
      price: product.price
    };
  
    // Ajouter le produit au panier temporaire (localStorage)
    const savedCart = localStorage.getItem('tempCart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
  
    // Ajouter le produit s'il n'existe pas déjà
    const existingProduct = cartItems.find((item: any) => item.productId === product.Product_ID);
    if (existingProduct) {
      existingProduct.quantity += 1; // Incrémenter la quantité si le produit est déjà dans le panier
    } else {
      cartItems.push(payload);
    }
  
    localStorage.setItem('tempCart', JSON.stringify(cartItems));
    console.log('Produit ajouté au panier temporaire:', cartItems);
  
    // Optionnel : Si l'utilisateur est connecté, ajouter le produit au panier côté serveur
    if (userId) {
      this.isLoading = true;
      this.cartService.addToCart(product.Product_ID, 1, userId).subscribe(
        (response) => {
          console.log('Produit ajouté au panier côté serveur', response);
          this.isLoading = false;
        },
        (error) => {
          console.error('Erreur lors de l\'ajout au panier côté serveur', error);
          this.isLoading = false;
        }
      );
    }
  }
  

// Fonction pour valider un ObjectId
isValidObjectId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id); // Vérifie si l'ID est une chaîne de 24 caractères hexadécimaux
}


  // Méthode pour obtenir un ID utilisateur temporaire ou en générer un
  private getTempUserId(): string {
    let userId = localStorage.getItem('tempUserId');
    if (!userId) {
      // Générer un ID unique temporaire si ce n'est pas déjà fait
      userId = this.generateUniqueId();
      localStorage.setItem('tempUserId', userId);
    }
    return userId;
  }

  // Générer un ID unique
  private generateUniqueId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}

