import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importez CommonModule
import { OrderService } from '../../services/order.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule,NavbarComponent,ProductListComponent,FormsModule]  // Ajoutez CommonModule dans imports
})
export class ClientDashboardComponent implements OnInit {

  activeTab: string = 'vehicleInfo'; // Default tab
  serialNumber: string = '';
  isLoading: boolean = false;

  vehicleInfo = {
    brand: '',
    year: '',
    model: '',
    tools: ''
  };

  
searchResults: any[] | null = null;
  orders: any[] = [];
  recommendations: any[] = [];
  

   // Données pour les marques, modèles, outils et années
   brands = ['Toyota', 'Ford', 'Honda'];
   yearsByBrand: { [key: string]: string[] } = {
     Toyota: ['2020', '2021', '2022'],
     Ford: ['2019', '2020', '2023'],
     Honda: ['2018', '2021', '2022']
   };

   modelsByBrand: { [key: string]: string[] } = {
    Toyota: ['Corolla', 'Camry', 'RAV4'],
    Ford: ['Fiesta', 'Focus', 'Mustang'],
    Honda: ['Civic', 'Accord', 'CR-V']
  };

  toolsByModel: { [key: string]: string[] } = {
    Corolla: ['Tool A', 'Tool B'],
    Camry: ['Tool C', 'Tool D'],
    RAV4: ['Tool E', 'Tool F'],
    Fiesta: ['Tool G', 'Tool H'],
    Focus: ['Tool I', 'Tool J'],
    Mustang: ['Tool K', 'Tool L'],
    Civic: ['Tool M', 'Tool N'],
    Accord: ['Tool O', 'Tool P'],
    CR_V: ['Tool Q', 'Tool R']
  };
  

  filteredYears: string[] = [];
  filteredModels: string[] = [];
  filteredTools: string[] = [];

    // Méthode pour filtrer les années selon la marque
    onBrandChange() {
      this.filteredYears = this.yearsByBrand[this.vehicleInfo.brand] || [];
      this.vehicleInfo.year = ''; // Réinitialise l'année sélectionnée
      this.filteredModels = []; // Réinitialise les modèles
      this.vehicleInfo.model = '';
      this.filteredTools = []; // Réinitialise les outils
      this.vehicleInfo.tools = '';
    }
  
    // Méthode pour filtrer les modèles selon la marque
    onYearChange() {
      this.filteredModels = this.modelsByBrand[this.vehicleInfo.brand] || [];
      this.vehicleInfo.model = ''; // Réinitialise le modèle sélectionné
      this.filteredTools = []; // Réinitialise les outils
      this.vehicleInfo.tools = '';
    }
  
    // Méthode pour filtrer les outils selon le modèle
    onModelChange() {
      this.filteredTools = this.toolsByModel[this.vehicleInfo.model] || [];
      this.vehicleInfo.tools = ''; // Réinitialise l'outil sélectionné
    }
  

  constructor(private orderService: OrderService,private http: HttpClient,private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    //this.loadOrders();
    this.loadRecommendations();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des commandes', error);
      }
    );
  }

  loadRecommendations(): void {
    // Implémentez votre logique de recommandations ou d'API ici
    this.recommendations = [
      { product: 'Produit C', price: 29.99 },
      { product: 'Produit D', price: 39.99 },
    ];
  }

  searchByVehicleInfo() {
    const { brand, year, model, tools } = this.vehicleInfo;

    if (!brand || !year || !model || !tools) {
      alert('Veuillez remplir toutes les informations du véhicule.');
      return;
    }

    const apiUrl = `http://localhost:8080/api/users/search`;
    const payload = { brand, year, model, tools };

    this.http.post(apiUrl, payload).subscribe(
      (response: any) => {
        this.searchResults = response.results || [];
      },
      (error) => {
        console.error('Erreur lors de la recherche :', error);
        alert('Une erreur s\'est produite lors de la recherche.');
      }
    );
  }

  searchBySerialNumber() {
    if (!this.serialNumber.trim()) {
      alert('Veuillez entrer un numéro de série.');
      return;
    }
  
    const apiUrl = `http://localhost:8080/api/users/searchno?no=${this.serialNumber}`;
  
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response && response.length > 0) {
          this.searchResults = response;
        } else {
          this.searchResults = []; // Si aucune donnée n'est trouvée
        }
      },
      (error) => {
        console.error('Erreur lors de la recherche :', error);
        alert('Une erreur s\'est produite lors de la recherche.');
        this.searchResults = []; // Mettre searchResults à un tableau vide en cas d'erreur
      }
    );
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
}


