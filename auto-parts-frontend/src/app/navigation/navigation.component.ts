import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ProductMainCategory } from '../interfaces/product-category.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavigationComponent implements OnInit {
  mainCategories: ProductMainCategory[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getMainCategories().subscribe({
      next: (categories) => {
        this.mainCategories = categories.map(cat => ({
          ...cat,
          icon: '',
          subCategories: [],
          isExpanded: false
        }));
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
}

  
  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/category', categoryId]);
  }

}