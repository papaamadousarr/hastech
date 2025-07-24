import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { 
  VehicleDetails, 
  ProductBrand, 
  ProductSubCategory, 
  ProductMainCategory as IProductMainCategory 
} from '../interfaces/product-category.interface';
import { catchError, of, map, timeout } from 'rxjs';
import { NotificationService } from './notification.service';

// Interfaces pour les nouvelles réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  details?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  subCategories: SubCategory[];
}

export interface SubCategoryResponse {
  id: string;
  name: string;
  image?: string;
  slug?: string;
}

export interface Product {
    _id?: string; // Ajout de _id pour MongoDB
    id: string;
    productName: string;
    vehicleGroup: string;
    productBrand: string;
    model: string;
    engine: string;
    year: string;
    descriptionEng: string;
    descriptionFr: string;
    bsgSubCategory: string;
    originCountry: string;
    packageQty: string;
    oe: string;
    description2Eng: string;
    description2Fr: string;
    productSubCategory: string;
    productCategory: string;
    // Propriétés ajoutées pour la compatibilité
    price?: number;
    inStock?: boolean;
    imageUrl?: string;
    additionalImages?: string[];
    dimensions?: string;
    weight?: number;
    material?: string;
    warranty?: string;
    createdAt?: string;
    updatedAt?: string;
    // Propriétés pour l'affichage
    name?: string;
    code?: string;
    brand?: string;
    category?: string;
    subcategory?: string;
    image?: string;
    details?: string;
    quantity?: number;
    // Propriétés pour les dimensions
    length?: number;
    width?: number;
    height?: number;
    // Propriétés pour les véhicules compatibles
    compatibleVehicles?: any[];
    oemNumbers?: string[];
    // Propriétés pour les spécifications
    mountSide?: string;
    // Nouveaux champs basés sur la structure JSON
    slug?: string;
    availability?: string;
    link?: string;
    compatibleCars?: Array<{
        vehicle?: {
            maker?: string;
            model?: string;
            model_details?: string;
            year_range?: string;
            specifications?: string;
        };
        raw_text?: string;
    }>;
    specifications?: {
        oem_numbers?: string[];
    };
    category_slug?: string;
    subcategory_slug?: string;
}

export interface ProductFilters {
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleEngine?: string;
  yearRange?: string;
  category?: string;
  subcategory?: string;
  availability?: string;
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
  oemNumber?: string;
  inStockOnly?: boolean;
  limit?: number;
}

export interface FilteredProductsResponse {
  products: Product[];
  total: number;
  filters: ProductFilters;
}

export interface VehicleModel {
  _id: string;
  name: string;
  brandId: string;
  slug: string;
  imageURL?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Engine {
  id: string;
  name: string;
  power: string;
  years: string;
  variantId?: string;
}

export interface SearchParams {
    vehicleGroup?: string;
    model?: string;
    engine?: string;
    year?: string;
}

export interface ProductMainCategory {
  id: string;
  name: string;
  imageUrl: string;
  // other properties...
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  isExpanded: boolean;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface Part {
  id: string;
  name: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/api';
    private readonly brandLogosPath = 'assets/images/vehicle_brand/';

    // Cache pour les données
    private categoriesCache: Category[] | null = null;
    private subcategoriesCache: Map<string, SubCategory[]> = new Map();
    private cacheExpiry: Map<string, number> = new Map();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // BehaviorSubject to track selected vehicle
    private selectedVehicle = new BehaviorSubject<{
        brand: string;
        model: string;
        engine: string;
    } | null>(null);

    selectedVehicle$ = this.selectedVehicle.asObservable();

    constructor(private http: HttpClient, private notificationService: NotificationService) {}

    // Méthodes utilitaires pour la gestion d'erreurs
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Une erreur est survenue';
        
        if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            // Erreur côté serveur
            if (error.error && error.error.error) {
                errorMessage = error.error.error;
            } else {
                errorMessage = `Erreur ${error.status}: ${error.message}`;
            }
        }
        
        console.error('API Error:', error);
        this.notificationService.showApiError(error);
        return throwError(() => new Error(errorMessage));
    }

    private extractData<T>(response: ApiResponse<T>): T {
        if (!response.success) {
            this.notificationService.showApiError({ error: response.error });
            throw new Error(response.error || 'Erreur de réponse API');
        }
        return response.data;
    }

    // Méthodes de cache
    private isCacheValid(key: string): boolean {
        const expiry = this.cacheExpiry.get(key);
        return expiry ? Date.now() < expiry : false;
    }

    private setCache<T>(key: string, data: T): void {
        this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
        if (key === 'categories') {
            this.categoriesCache = data as Category[];
        } else if (key.startsWith('subcategories_')) {
            const categoryId = key.replace('subcategories_', '');
            this.subcategoriesCache.set(categoryId, data as SubCategory[]);
        }
    }

    private getCache<T>(key: string): T | null {
        if (!this.isCacheValid(key)) {
            return null;
        }
        
        if (key === 'categories') {
            return this.categoriesCache as T;
        } else if (key.startsWith('subcategories_')) {
            const categoryId = key.replace('subcategories_', '');
            return this.subcategoriesCache.get(categoryId) as T;
        }
        return null;
    }

    private clearCache(): void {
        this.categoriesCache = null;
        this.subcategoriesCache.clear();
        this.cacheExpiry.clear();
    }

    // Vehicle-related methods
    getBrandLogo(brand: string): string {
        return `${this.brandLogosPath}${brand.toLowerCase()}.svg`;
    }


    getAllVehicleBrands(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/vehicle_brands`).pipe(
            timeout(30000), // 30 secondes de timeout
            catchError(this.handleError)
        );
    }

    getModelsForBrand(brandId: string): Observable<VehicleModel[]> {
        // Convertir le brandId en slug (minuscules et remplacer les espaces par des tirets)
        const brandSlug = brandId.toLowerCase().replace(/\s+/g, '-');
        return this.http.get<VehicleModel[]>(`${this.apiUrl}/vehicle_models/${brandSlug}`);
    }

    getEnginesForModel(brand: string, modelId: string): Observable<Engine[]> {
        // Convertir le modelId en slug (minuscules et remplacer les espaces par des tirets)
        const modelSlug = modelId.toLowerCase().replace(/\s+/g, '-');
        
        // Récupérer d'abord les variants pour ce modèle, puis les engines pour chaque variant
        return new Observable(observer => {
            // Appel pour récupérer les variants
            this.http.get<any[]>(`${this.apiUrl}/vehicle_variants/${modelSlug}`).subscribe({
                next: (variants) => {
                    if (variants.length === 0) {
                        observer.next([]);
                        observer.complete();
                        return;
                    }

                    // Pour chaque variant, récupérer les engines
                    const enginePromises = variants.map(variant => 
                        this.http.get<any[]>(`${this.apiUrl}/vehicle_engines/${variant._id}`).toPromise()
                    );

                    Promise.all(enginePromises).then(engineArrays => {
                        const allEngines: Engine[] = [];
                        
                        engineArrays.forEach((engines, index) => {
                            if (engines && engines.length > 0) {
                                engines.forEach(engine => {
                                    allEngines.push({
                                        id: engine._id,
                                        name: `${variants[index].name} - ${engine.name}`,
                                        power: engine.power || '',
                                        years: engine.years || '',
                                        variantId: engine.variantId
                                    });
                                });
                            }
                        });

                        observer.next(allEngines);
                        observer.complete();
                    }).catch(error => {
                        console.error('Error loading engines:', error);
                        observer.next([]);
                        observer.complete();
                    });
                },
                error: (error) => {
                    console.error('Error loading variants:', error);
                    observer.next([]);
                    observer.complete();
                }
            });
        });
    }

    setSelectedVehicle(brand: string, model: string, engine: string) {
        this.selectedVehicle.next({ brand, model, engine });
    }

    clearVehicleSelection() {
        this.selectedVehicle.next(null);
    }

    getVehicleDetails(brand: string, model: string, engine: string): Observable<VehicleDetails[]> {
        return this.http.get<VehicleDetails[]>(`${this.apiUrl}/vehicles/${brand}/${model}/${engine}`);
    }

    // Existing product-related methods
    getAllProducts(): Observable<Product[]> {
        return this.http.get<any>(`${this.apiUrl}/products`).pipe(
            timeout(30000), // 30 secondes de timeout
            map(response => {
                // Si la réponse est un tableau (ancien format), le retourner directement
                if (Array.isArray(response)) {
                    return response;
                }
                // Si la réponse est un objet avec la propriété products (nouveau format)
                if (response && response.products && Array.isArray(response.products)) {
                    return response.products;
                }
                // Fallback: retourner un tableau vide
                return [];
            }),
            catchError(this.handleError)
        );
    }

    searchProducts(params: SearchParams): Observable<Product[]> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach((key) => {
            const typedKey = key as keyof SearchParams;
            if (params[typedKey]) {
                httpParams = httpParams.set(typedKey, params[typedKey]!);
            }

        });
        return this.http.get<Product[]>(`${this.apiUrl}/products/search`, { params: httpParams });
    }

    getProductById(id: string): Observable<Product> {
        console.log('ProductService: Calling API for product ID:', id);
        console.log('ProductService: API URL:', `${this.apiUrl}/products/${id}`);
        
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
            map(response => {
                console.log('ProductService: API response received:', response);
                return response;
            }),
            catchError(error => {
                console.error('ProductService: Error fetching product by ID:', error);
                return throwError(() => error);
            })
        );
    }

    // Category-related methods
    getMainCategories(): Observable<ProductMainCategory[]> {
        return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
            map(response => {
                // Handle the API response structure {success: true, data: [...]}
                if (response && response.success && response.data) {
                    return response.data;
                }
                return []; // Return empty array if no data
            }),
            catchError(error => {
                console.error('Error loading categories:', error);
                return of([]); // Return empty array on error
            })
        );
    }

    getSubCategories(mainCategoryId: string): Observable<ProductSubCategory[]> {
        return this.http.get<any>(
            `${this.apiUrl}/categories/${mainCategoryId}/subcategories`
        ).pipe(
            map(response => {
                // Handle the API response structure {success: true, data: [...]}
                if (response && response.success && response.data) {
                    return response.data;
                }
                return []; // Return empty array if no data
            }),
            catchError(error => {
                console.error('Error loading subcategories:', error);
                return of([]); // Return empty array on error
            })
        );
    }

    // Récupérer toutes les catégories depuis la base de données
    getAllCategories(): Observable<Category[]> {
        // Vérifier le cache d'abord
        const cachedData = this.getCache<Category[]>('categories');
        if (cachedData) {
            return of(cachedData);
        }

        return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`)
            .pipe(
                map(response => {
                    const data = this.extractData(response);
                    this.setCache('categories', data);
                    return data;
                }),
                catchError(this.handleError)
            );
    }

    // Récupérer les sous-catégories d'une catégorie (nouvelle méthode)
    getSubCategoriesByCategory(categoryId: string): Observable<SubCategory[]> {
        if (!categoryId) {
            return throwError(() => new Error('Category ID is required'));
        }
        
        // Vérifier le cache d'abord
        const cacheKey = `subcategories_${categoryId}`;
        const cachedData = this.getCache<SubCategory[]>(cacheKey);
        if (cachedData) {
            return of(cachedData);
        }
        
        return this.http.get<ApiResponse<SubCategory[]>>(`${this.apiUrl}/categories/${categoryId}/subcategories`)
            .pipe(
                map(response => {
                    const data = this.extractData(response);
                    this.setCache(cacheKey, data);
                    return data;
                }),
                catchError(this.handleError)
            );
    }

    // Récupérer les pièces d'une sous-catégorie
    getParts(subcategoryId: string): Observable<Part[]> {
      return this.http.get<Part[]>(`${this.apiUrl}/subcategories/${subcategoryId}/parts`)
        .pipe(
          catchError(error => {
            console.error('Error fetching parts:', error);
            return of([]);
          })
        );
    }

    // Helper method to get products by vehicle details
    getProductsByVehicle(brand: string, model: string, engine: string): Observable<FilteredProductsResponse> {
        const filters: ProductFilters = {
            vehicleBrand: brand,
            vehicleModel: model,
            vehicleEngine: engine
        };
        return this.searchProductsWithFilters(filters);
    }

    // New filtering methods
    searchProductsWithFilters(filters: ProductFilters): Observable<FilteredProductsResponse> {
        let httpParams = new HttpParams();
        
        Object.keys(filters).forEach((key) => {
            const typedKey = key as keyof ProductFilters;
            if (filters[typedKey] !== undefined && filters[typedKey] !== null && filters[typedKey] !== '') {
                if (typeof filters[typedKey] === 'number') {
                    httpParams = httpParams.set(typedKey, filters[typedKey]!.toString());
                } else {
                    httpParams = httpParams.set(typedKey, filters[typedKey]!.toString());
                }
            }
        });
        
        return this.http.get<FilteredProductsResponse>(`${this.apiUrl}/products/search`, { params: httpParams });
    }

    // Helper method to get compatible vehicles for a product
    getCompatibleVehicles(productId: string): Observable<VehicleDetails[]> {
        return this.http.get<VehicleDetails[]>(`${this.apiUrl}/products/${productId}/vehicles`);
    }
 /*
    getVehicleImages(params: {
        brand?: string;
        model?: string;
        engine?: string;
    }): Observable<VehicleImage> {
        return this.http.get<VehicleImage>(`${this.apiUrl}/vehicle-images`, { params });
    }

    getVehicleImagesByBrand(brand: string): Observable<VehicleImage[]> {
        return this.http.get<VehicleImage[]>(`${this.apiUrl}/vehicle-images/brand/${brand}`);
    }

*/

    // Update your existing getModelImage method
  getModelImage(brand: string, model: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/vehicle-images/${brand}/${model}`);
  }

  
}
