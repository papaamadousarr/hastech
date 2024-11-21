import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  // Ensure FormsModule is imported here
  ]
})
export class AddProductComponent {
  product = { _id:'',product_name: '', rating: 0,price: 0, image: null as File | null,noserie: 0, category: '' };

  constructor(private productService: ProductService,private cartService: CartService, private authService: AuthService) {}

  // Méthode pour gérer l'upload de l'image
  onFileChange(event: any) {
    const file = event.target.files[0]; // Récupérer le premier fichier sélectionné
    if (file) {
      this.product.image = file;
    }
  }
   // Méthode de soumission du formulaire
   addProduct() {
    const formData = new FormData();
    formData.append('product_name', this.product.product_name);
    formData.append('rating', this.product.rating.toString());
    formData.append('price', this.product.price.toString());
    formData.append('noserie', this.product.noserie.toString());
    formData.append('category', this.product.category);
    
    if (this.product.image) {
      formData.append('image', this.product.image, this.product.image.name);  // Ajout de l'image
    }
    console.log(formData);
    
    // Appel au service ou API pour enregistrer le produit
    this.productService.addProduct(formData).subscribe(
      (response) => {
        console.log('Produit ajouté avec succès:', response);
        this.product = {_id: '', product_name: '', rating: 0, price: 0, image: null, noserie: 0, category: ''}; // Réinitialiser le formulaire
      },
      (error) => {
        console.error("Erreur lors de l'ajout du produit:", error);
      }
    );
  }

  
}
