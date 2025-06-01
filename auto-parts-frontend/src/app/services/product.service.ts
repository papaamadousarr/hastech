import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { 
  VehicleDetails, 
  ProductBrand, 
  ProductSubCategory, 
  ProductMainCategory as IProductMainCategory 
} from '../interfaces/product-category.interface';


export interface Product {
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
}

export interface VehicleModel {
  id: string;
  name: string;
  years: string;
  image?: string;
}

export interface Engine {
  id: string;
  name: string;
  power: string;
  years: string;
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

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/api';
    private readonly brandLogosPath = 'assets/images/vehicle_brand/';

    // BehaviorSubject to track selected vehicle
    private selectedVehicle = new BehaviorSubject<{
        brand: string;
        model: string;
        engine: string;
    } | null>(null);

    selectedVehicle$ = this.selectedVehicle.asObservable();

    constructor(private http: HttpClient) {}

    // Vehicle-related methods
    getBrandLogo(brand: string): string {
        return `${this.brandLogosPath}${brand.toLowerCase()}.svg`;
    }


    getAllVehicleBrands(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/vehicles/brands`);
    }

    getModelsForBrand(brand: string): Observable<VehicleModel[]> {
        return this.http.get<VehicleModel[]>(`${this.apiUrl}/vehicles/${brand}/models`);
    }

    getEnginesForModel(brand: string, modelId: string): Observable<Engine[]> {
        return this.http.get<Engine[]>(`${this.apiUrl}/vehicles/${brand}/${modelId}/engines`);
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
        return this.http.get<Product[]>(`${this.apiUrl}/products`);
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
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    }

    // Category-related methods
    getMainCategories(): Observable<ProductMainCategory[]> {
        return this.http.get<ProductMainCategory[]>(`${this.apiUrl}/categories`);
    }

    getSubCategories(mainCategoryId: string): Observable<ProductSubCategory[]> {
        return this.http.get<ProductSubCategory[]>(
            `${this.apiUrl}/categories/${mainCategoryId}/subcategories`
        );
    }

    // Helper method to get products by vehicle details
    getProductsByVehicle(brand: string, model: string, engine: string): Observable<Product[]> {
        const params = new HttpParams()
            .set('brand', brand)
            .set('model', model)
            .set('engine', engine);
        
        return this.http.get<Product[]>(`${this.apiUrl}/products/vehicle`, { params });
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