import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, Product, ProductFilters } from '../services/product.service';
import { SearchService, SearchFilters } from '../services/search.service';
import { NotificationService } from '../services/notification.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  totalPages = 0;
  
  // Filtres
  filterForm: FormGroup;
  showFilters = false;
  
  // Tri
  sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'newest', label: 'Plus récents' }
  ];
  
  // Affichage
  viewMode: 'grid' | 'list' = 'grid';
  
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      subcategory: [''],
      brand: [''],
      minPrice: [null],
      maxPrice: [null],
      inStockOnly: [false],
      vehicleBrand: [''],
      vehicleModel: [''],
      sortBy: ['relevance']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFilterListeners();
    this.applyUrlParams();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearchComplete(searchData: any) {
    if (searchData.type === 'search') {
      // Navigate to search results page with the search data
      this.router.navigate(['/search-results'], { 
        queryParams: { 
          brand: searchData.brand,
          model: searchData.model,
          year: searchData.year
        }
      });
    }
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalItems = products.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        this.notificationService.showApiError(error);
      }
    });
  }

  private setupFilterListeners(): void {
    this.subscription.add(
      this.filterForm.valueChanges.subscribe(() => {
        this.currentPage = 1; // Reset to first page when filters change
        this.applyFilters();
      })
    );
  }

  private applyFilters(): void {
    let filtered = [...this.products];
    const filters = this.filterForm.value;

    // Filtre par terme de recherche
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm) ||
        product.descriptionEng.toLowerCase().includes(searchTerm) ||
        product.oe.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par catégorie
    if (filters.category) {
      filtered = filtered.filter(product =>
        product.productCategory.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filtre par sous-catégorie
    if (filters.subcategory) {
      filtered = filtered.filter(product =>
        product.productSubCategory.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    // Filtre par marque
    if (filters.brand) {
      filtered = filtered.filter(product =>
        product.productBrand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Filtre par prix minimum
    if (filters.minPrice) {
      filtered = filtered.filter(product => (product.price || 0) >= filters.minPrice);
    }

    // Filtre par prix maximum
    if (filters.maxPrice) {
      filtered = filtered.filter(product => (product.price || 0) <= filters.maxPrice);
    }

    // Filtre par disponibilité
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock !== false);
    }

    // Filtre par marque de véhicule
    if (filters.vehicleBrand) {
      filtered = filtered.filter(product =>
        product.vehicleGroup.toLowerCase().includes(filters.vehicleBrand.toLowerCase())
      );
    }

    // Filtre par modèle de véhicule
    if (filters.vehicleModel) {
      filtered = filtered.filter(product =>
        product.model.toLowerCase().includes(filters.vehicleModel.toLowerCase())
      );
    }

    // Tri
    this.sortProducts(filtered, filters.sortBy);

    this.filteredProducts = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  private sortProducts(products: Product[], sortBy: string): void {
    switch (sortBy) {
      case 'name':
        products.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'price':
        products.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        products.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        break;
      default:
        // Pertinence - garder l'ordre original
        break;
    }
  }

  private applyUrlParams(): void {
    this.route.queryParams.subscribe(params => {
      const formValues: any = {};
      
      if (params['search']) formValues.searchTerm = params['search'];
      if (params['category']) formValues.category = params['category'];
      if (params['subcategory']) formValues.subcategory = params['subcategory'];
      if (params['brand']) formValues.brand = params['brand'];
      if (params['minPrice']) formValues.minPrice = Number(params['minPrice']);
      if (params['maxPrice']) formValues.maxPrice = Number(params['maxPrice']);
      if (params['inStock']) formValues.inStockOnly = params['inStock'] === 'true';
      if (params['vehicleBrand']) formValues.vehicleBrand = params['vehicleBrand'];
      if (params['vehicleModel']) formValues.vehicleModel = params['vehicleModel'];
      if (params['sortBy']) formValues.sortBy = params['sortBy'];
      if (params['page']) this.currentPage = Number(params['page']);

      this.filterForm.patchValue(formValues);
    });
  }

  // Pagination
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrlParams();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateUrlParams();
  }

  // Navigation
  onProductClick(product: Product): void {
    this.router.navigate(['/product', product.id || product.oe]);
  }

  // Actions
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.updateUrlParams();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  private updateUrlParams(): void {
    const params = this.filterForm.value;
    params.page = this.currentPage;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  // Utilitaires
  getProductImage(product: Product): string {
    return product.imageUrl || product.image || 'assets/images/placeholders/product.jpg';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  addToCart(product: Product): void {
    // Implémenter l'ajout au panier
    console.log('Adding to cart:', product);
    this.notificationService.showSuccess('Produit ajouté au panier');
  }

  addToFavorites(product: Product): void {
    // Implémenter l'ajout aux favoris
    console.log('Adding to favorites:', product);
    this.notificationService.showSuccess('Produit ajouté aux favoris');
  }
}
