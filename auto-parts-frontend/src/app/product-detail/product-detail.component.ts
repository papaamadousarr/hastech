import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Import your product list or service
import { PRODUCTS } from '../../assets/data/products'; // adjust path as needed

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    this.product = PRODUCTS.find(p => p.code === code);
    console.log(this.product);
  }

  decrementQty() {
    if (this.product.quantity > 1) this.product.quantity--;
  }

  incrementQty() {
    this.product.quantity++;
  }

  addToCart() {
    alert(`Added ${this.product.name} to cart!`);
  }
}
