import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Subcategory {
  name: string;
  slug: string;
  image?: string;
}

interface Category {
  name: string;
  slug: string;
  image: string;
  subcategories: Subcategory[];
  showAll?: boolean;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Category[]>('assets/data/categories_en.json').subscribe({
      next: (data) => {
        this.categories = data.map(cat => ({
          ...cat,
          subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [],
          showAll: false
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  toggleShowAll(selectedCategory: Category) {
    this.categories.forEach(cat => {
      if (cat === selectedCategory) {
        cat.showAll = !cat.showAll;
      } else {
        cat.showAll = false;
      }
    });
  }
}