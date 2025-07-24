import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { NotificationService } from '../services/notification.service';
import { CartService } from '../services/cart.service';
import { FavoritesService, FavoriteProduct } from '../services/favorites.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
  product: any = null;
  loading = true;
  error: string | null = null;
  expandedBrands: Set<string> = new Set();
  
  // État du produit
  quantity = 1;
  isInCart = false;
  isInFavorites = false;
  
  // Images
  selectedImageIndex = 0;
  productImages: string[] = [];
  
  // Informations complémentaires
  compatibleVehicles: any[] = [];
  relatedProducts: Product[] = [];
  
  // Onglets
  activeTab: 'details' | 'specifications' | 'compatibility' | 'reviews' = 'details';
  
  // État pour les caractéristiques
  showAllFeatures = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    console.log('ProductDetailComponent initialized');
    this.route.params.subscribe(params => {
      const productId = params['code'] || params['id'];
      console.log('Route params:', params);
      console.log('Product ID from route:', productId);
      if (productId) {
        this.loadProduct(productId);
      } else {
        console.error('No product ID found in route params');
        this.error = 'No product ID provided';
        this.loading = false;
      }
    });
  }

  loadProduct(productId: string): void {
    this.loading = true;
    this.error = null;
    console.log('Loading product with ID:', productId);

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        console.log('Product loaded:', product);
        console.log('Product structure:', {
          id: product.id,
          _id: product._id,
          name: product.name,
          productName: product.productName,
          price: product.price,
          brand: product.brand,
          productBrand: product.productBrand
        });
        this.product = product;
        this.setupProductImages();
        this.loadCompatibleVehicles();
        this.loadRelatedProducts();
        this.checkCartStatus();
        this.checkFavoritesStatus();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product';
        this.loading = false;
      }
    });
  }

  private setupProductImages(): void {
    if (this.product) {
      this.productImages = [];
      
      // Image principale
      if (this.product.image) {
        this.productImages.push(this.product.image);
      } else if (this.product.imageUrl) {
        this.productImages.push(this.product.imageUrl);
      }
      
      // Images supplémentaires (si disponibles)
      if (this.product.additionalImages) {
        this.productImages.push(...this.product.additionalImages);
      }
      
      // Image par défaut si aucune image
      if (this.productImages.length === 0) {
        this.productImages.push('assets/images/placeholders/slide1.jpg');
      }
    }
  }

  private loadCompatibleVehicles(): void {
    if (!this.product?._id) return;

    this.productService.getCompatibleVehicles(this.product._id).pipe(
      catchError(error => {
        console.error('Error loading compatible vehicles:', error);
        return of([]);
      })
    ).subscribe({
      next: (vehicles) => {
        this.compatibleVehicles = vehicles || [];
      }
    });
  }

  private loadRelatedProducts(): void {
    if (!this.product) return;

    // Charger des produits similaires basés sur la catégorie
    this.productService.searchProductsWithFilters({
      category: this.product.productCategory,
      subcategory: this.product.productSubCategory,
      limit: 4
    }).pipe(
      catchError(error => {
        console.error('Error loading related products:', error);
        return of({ products: [] });
      })
    ).subscribe({
      next: (response) => {
        this.relatedProducts = response.products.filter(p => p._id !== this.product?._id);
      }
    });
  }

  private checkCartStatus(): void {
    if (!this.product) return;
    
    this.cartService.getCart().subscribe({
      next: (cart: any) => {
        this.isInCart = cart.items.some((item: any) => 
          item.id === this.product?._id || item.productId === this.product?._id
        );
      }
    });
  }

  private checkFavoritesStatus(): void {
    if (!this.product) return;
    
    this.favoritesService.getFavorites().subscribe({
      next: (favorites: FavoriteProduct[]) => {
        this.isInFavorites = favorites.some((fav: FavoriteProduct) => fav.id === this.product?._id);
      }
    });
  }

  // Actions utilisateur
  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQty(): void {
    this.quantity++;
  }

  addToCart(): void {
    if (!this.product || !this.product._id) return;

    this.cartService.addToCart({
      productId: this.product._id,
      quantity: this.quantity,
      price: this.product.price
    }).subscribe({
      next: () => {
        this.isInCart = true;
        this.notificationService.showSuccess('Produit ajouté au panier');
      },
      error: (error: any) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  removeFromCart(): void {
    if (!this.product || !this.product._id) return;

    this.cartService.removeFromCart(this.product._id).subscribe({
      next: () => {
        this.isInCart = false;
        this.notificationService.showSuccess('Produit retiré du panier');
      },
      error: (error: any) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  toggleFavorites(): void {
    if (!this.product || !this.product._id) return;

    if (this.isInFavorites) {
      this.favoritesService.removeFromFavorites(this.product._id).subscribe({
        next: () => {
          this.isInFavorites = false;
          this.notificationService.showSuccess('Produit retiré des favoris');
        },
        error: (error: any) => {
          this.notificationService.showApiError(error);
        }
      });
    } else {
      this.favoritesService.addToFavorites(this.product._id).subscribe({
        next: () => {
          this.isInFavorites = true;
          this.notificationService.showSuccess('Produit ajouté aux favoris');
        },
        error: (error: any) => {
          this.notificationService.showApiError(error);
        }
      });
    }
  }

  // Navigation des images
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  nextImage(): void {
    if (this.selectedImageIndex < this.productImages.length - 1) {
      this.selectedImageIndex++;
    }
  }

  previousImage(): void {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }

  // Navigation
  onRelatedProductClick(product: Product): void {
    const productId = product._id || product.oe || product.id;
    if (productId) {
      this.router.navigate(['/product', productId]);
    }
  }

  // Onglets
  setActiveTab(tab: 'details' | 'specifications' | 'compatibility' | 'reviews'): void {
    this.activeTab = tab;
  }

  // Caractéristiques
  toggleFeatures(): void {
    this.showAllFeatures = !this.showAllFeatures;
  }

  // Méthode pour obtenir les informations supplémentaires
  getAdditionalFeatures(): any[] {
    if (!this.product) return [];

    const features = [];
    
    // Informations de base
    if (this.product.availability) {
      features.push({ label: 'Availability', value: this.product.availability });
    }
    
    if (this.product.category_slug) {
      features.push({ label: 'Category', value: this.product.category_slug });
    }
    
    if (this.product.subcategory_slug) {
      features.push({ label: 'Subcategory', value: this.product.subcategory_slug });
    }
    
    if (this.product.slug) {
      features.push({ label: 'Slug', value: this.product.slug });
    }
    
    if (this.product.link) {
      features.push({ label: 'External Link', value: this.product.link });
    }

    return features;
  }

  // Méthodes utilitaires
  hasCompatibleCars(): boolean {
    return !!(this.product?.compatibleCars && this.product.compatibleCars.length > 0);
  }

  hasOemNumbers(): boolean {
    return !!(this.product?.specifications?.oem_numbers && this.product.specifications.oem_numbers.length > 0);
  }

  // Method to reload product without parameters (for retry button)
  reloadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  // Méthodes pour gérer l'affichage des compatibilités
  getBrandGroups(): any[] {
    if (!this.product?.compatibleCars) return [];
    
    const brandMap = new Map<string, any[]>();
    
    this.product.compatibleCars.forEach((car: any) => {
      try {
        // Parser les données de véhicule
        let vehicleData;
        if (car.vehicle && typeof car.vehicle === 'string') {
          vehicleData = JSON.parse(car.vehicle.replace(/'/g, '"'));
        } else if (car.raw_text && typeof car.raw_text === 'string') {
          vehicleData = JSON.parse(car.raw_text.replace(/'/g, '"'));
        } else {
          vehicleData = car.vehicle || car.raw_text;
        }
        
        if (!vehicleData || !vehicleData.maker) return;
        
        const brand = vehicleData.maker;
        if (!brandMap.has(brand)) {
          brandMap.set(brand, []);
        }
        
        // Créer un objet modèle avec les détails
        const model = {
          name: vehicleData.model || 'Unknown Model',
          details: vehicleData.model_details || '',
          yearRange: vehicleData.year_range || '',
          specifications: vehicleData.specifications || '',
          fullText: car.raw_text || ''
        };
        
        // Vérifier si ce modèle existe déjà
        const existingModel = brandMap.get(brand)?.find(m => 
          m.name === model.name && m.details === model.details
        );
        
        if (!existingModel) {
          brandMap.get(brand)!.push(model);
        }
      } catch (e) {
        console.error('Error parsing vehicle data:', e);
      }
    });
    
    // Convertir en tableau et trier
    const result = Array.from(brandMap.entries()).map(([brand, models]) => ({
      brand,
      models: models.sort((a, b) => a.name.localeCompare(b.name))
    }));
    
    return result.sort((a, b) => a.brand.localeCompare(b.brand));
  }

  // Méthodes pour l'accordéon
  toggleBrand(brand: string): void {
    if (this.expandedBrands.has(brand)) {
      this.expandedBrands.delete(brand);
    } else {
      this.expandedBrands.add(brand);
    }
  }

  isBrandExpanded(brand: string): boolean {
    return this.expandedBrands.has(brand);
  }

  // Méthodes pour gérer l'affichage des numéros OEM
  getOemNumbers(): string[] {
    if (!this.product?.specifications?.oem_numbers) return [];
    
    const oemNumbers: string[] = [];
    
    this.product.specifications.oem_numbers.forEach((oemStr: string) => {
      try {
        // Essayer de parser comme JSON
        const oemData = JSON.parse(oemStr.replace(/'/g, '"'));
        if (oemData && oemData.number) {
          oemNumbers.push(oemData.number);
        } else if (typeof oemData === 'string') {
          oemNumbers.push(oemData);
        }
      } catch (e) {
        // Si ce n'est pas du JSON, utiliser directement la chaîne
        oemNumbers.push(oemStr);
      }
    });
    
    return oemNumbers;
  }

  // Méthodes pour les marques OEM
  getOemBrands(oemNumber: string): string[] {
    if (!this.product?.specifications?.oem_numbers) return [];
    
    const brands: string[] = [];
    
    this.product.specifications.oem_numbers.forEach((oemStr: string) => {
      try {
        const oemData = JSON.parse(oemStr.replace(/'/g, '"'));
        if (oemData && oemData.number === oemNumber && oemData.manufacturer) {
          brands.push(oemData.manufacturer);
        }
      } catch (e) {
        // Ignorer les erreurs de parsing
      }
    });
    
    return [...new Set(brands)]; // Supprimer les doublons
  }

  // Méthode pour copier les numéros OEM
  copyOemNumber(number: string): void {
    navigator.clipboard.writeText(number).then(() => {
      console.log('OEM number copied:', number);
    }).catch(err => {
      console.error('Failed to copy OEM number:', err);
    });
  }

  // Méthode pour obtenir le logo de la marque
  getBrandLogo(brand: string): string {
    const brandLower = brand.toLowerCase();
    const brandMappings: { [key: string]: string } = {
      'audi': 'assets/images/vehicle_brand/audi.svg',
      'bmw': 'assets/images/vehicle_brand/bmw.svg',
      'mercedes': 'assets/images/vehicle_brand/mercedes-benz.svg',
      'volkswagen': 'assets/images/vehicle_brand/volkswagen.svg',
      'toyota': 'assets/images/vehicle_brand/toyota.svg',
      'honda': 'assets/images/vehicle_brand/honda.svg',
      'ford': 'assets/images/vehicle_brand/ford.svg',
      'peugeot': 'assets/images/vehicle_brand/peugeot.svg',
      'renault': 'assets/images/vehicle_brand/renault.svg',
      'citroen': 'assets/images/vehicle_brand/citroen.svg',
      'opel': 'assets/images/vehicle_brand/opel.svg',
      'volvo': 'assets/images/vehicle_brand/volvo.svg',
      'skoda': 'assets/images/vehicle_brand/skoda.svg',
      'seat': 'assets/images/vehicle_brand/seat.svg',
      'fiat': 'assets/images/vehicle_brand/fiat.svg',
      'alfa romeo': 'assets/images/vehicle_brand/alfa-romeo.svg',
      'lancia': 'assets/images/vehicle_brand/lancia.svg',
      'nissan': 'assets/images/vehicle_brand/nissan.svg',
      'mazda': 'assets/images/vehicle_brand/mazda.svg',
      'mitsubishi': 'assets/images/vehicle_brand/mitsubishi.svg',
      'subaru': 'assets/images/vehicle_brand/subaru.svg',
      'lexus': 'assets/images/vehicle_brand/lexus.svg',
      'infiniti': 'assets/images/vehicle_brand/infiniti.svg',
      'hyundai': 'assets/images/vehicle_brand/hyundai.svg',
      'kia': 'assets/images/vehicle_brand/kia.svg',
      'daewoo': 'assets/images/vehicle_brand/daewoo.svg',
      'chevrolet': 'assets/images/vehicle_brand/chevrolet.svg',
      'cadillac': 'assets/images/vehicle_brand/cadillac.svg',
      'buick': 'assets/images/vehicle_brand/buick.svg',
      'pontiac': 'assets/images/vehicle_brand/pontiac.svg',
      'oldsmobile': 'assets/images/vehicle_brand/oldsmobile.svg',
      'saturn': 'assets/images/vehicle_brand/saturn.svg',
      'hummer': 'assets/images/vehicle_brand/hummer.svg',
      'saab': 'assets/images/vehicle_brand/saab.svg',
      'jaguar': 'assets/images/vehicle_brand/jaguar.svg',
      'land rover': 'assets/images/vehicle_brand/land-rover.svg',
      'mini': 'assets/images/vehicle_brand/mini.svg',
      'smart': 'assets/images/vehicle_brand/smart.svg',
      'porsche': 'assets/images/vehicle_brand/porsche.svg',
      'ferrari': 'assets/images/vehicle_brand/ferrari.svg',
      'lamborghini': 'assets/images/vehicle_brand/lamborghini.svg',
      'maserati': 'assets/images/vehicle_brand/maserati.svg',
      'bentley': 'assets/images/vehicle_brand/bentley.svg',
      'rolls royce': 'assets/images/vehicle_brand/rolls-royce.svg',
      'aston martin': 'assets/images/vehicle_brand/aston-martin.svg',
      'lotus': 'assets/images/vehicle_brand/lotus.svg',
      'morgan': 'assets/images/vehicle_brand/morgan.svg',
      'tvr': 'assets/images/vehicle_brand/tvr.svg',
      'noble': 'assets/images/vehicle_brand/noble.svg',
      'ariel': 'assets/images/vehicle_brand/ariel.svg',
      'caterham': 'assets/images/vehicle_brand/caterham.svg',
      'westfield': 'assets/images/vehicle_brand/westfield.svg',
      'radical': 'assets/images/vehicle_brand/radical.svg',
      'ultima': 'assets/images/vehicle_brand/ultima.svg',
      'gumpert': 'assets/images/vehicle_brand/gumpert.svg',
      'wiesmann': 'assets/images/vehicle_brand/wiesmann.svg',
      'spyker': 'assets/images/vehicle_brand/spyker.svg',
      'pagani': 'assets/images/vehicle_brand/pagani.svg',
      'koenigsegg': 'assets/images/vehicle_brand/koenigsegg.svg',
      'bugatti': 'assets/images/vehicle_brand/bugatti.svg',
      'mclaren': 'assets/images/vehicle_brand/mclaren.svg'
    };
    
    return brandMappings[brandLower] || 'assets/images/vehicle_brand/default.svg';
  }

  // Utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getCurrentImage(): string {
    return this.productImages[this.selectedImageIndex] || 'assets/images/placeholders/slide1.jpg';
  }

  getProductSpecifications(): any[] {
    if (!this.product) return [];

    const specs = [];
    
    if (this.product.dimensions) {
      specs.push({ label: 'Dimensions', value: this.product.dimensions });
    }
    
    if (this.product.weight) {
      specs.push({ label: 'Poids', value: `${this.product.weight} kg` });
    }
    
    if (this.product.material) {
      specs.push({ label: 'Matériau', value: this.product.material });
    }
    
    if (this.product.warranty) {
      specs.push({ label: 'Garantie', value: this.product.warranty });
    }

    return specs;
  }

  shareProduct(): void {
    if (navigator.share) {
      navigator.share({
        title: this.product?.productName,
        text: this.product?.descriptionEng,
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
      this.notificationService.showSuccess('Lien copié dans le presse-papiers');
    }
  }
}
