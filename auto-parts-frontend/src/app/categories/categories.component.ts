import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Category {
  name: string;
  slug: string;
  icon: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CategoriesComponent {
  categories: Category[] = [
    { name: 'Filters', slug: 'filters', icon: 'filter.svg' },
    { name: 'Oils and Fluids', slug: 'oils-and-fluids', icon: 'oil.svg' },
    { name: 'Brakes', slug: 'brakes', icon: 'brake.svg' },
    { name: 'Motor', slug: 'engine', icon: 'engine.svg' },
    { name: 'Suspension', slug: 'suspension', icon: 'suspension.svg' },
    { name: 'Lighting', slug: 'lighting', icon: 'lighting.svg' },
    { name: 'Heating & Cooling', slug: 'heating-cooling', icon: 'heating.svg' },
    { name: 'Electrical', slug: 'electrical', icon: 'electrical.svg' },
    { name: 'Transmission', slug: 'transmission', icon: 'transmission.svg' },
    { name: 'Clutch', slug: 'clutch', icon: 'clutch.svg' },
    { name: 'Fuel System', slug: 'fuel-system', icon: 'fuel.svg' },
    { name: 'Exhaust', slug: 'exhaust', icon: 'exhaust.svg' },
    { name: 'Body Parts', slug: 'body-parts', icon: 'body.svg' },
    { name: 'Interior', slug: 'interior', icon: 'interior.svg' },
    { name: 'AC System', slug: 'ac-system', icon: 'ac.svg' }
  ];
}