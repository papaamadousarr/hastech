import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product: any;

  constructor(private cartService: CartService, private authService: AuthService) {}

  addToCart(): void {
    const userId = this.authService.getUserId();
    if (userId && this.product) {
      this.cartService.addToCart(this.product.id, 1, userId).subscribe(() => {
        console.log('Produit ajouté au panier');
      });
    }
  }
}
