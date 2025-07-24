import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleBrand, VehicleModel, VehicleVariant, VehicleEngine } from '../interfaces/vehicle.interface';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Existing methods...

  // Get vehicles by brand
  getVehiclesByBrand(brand: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicles/brand/${brand}`);
  }

  // Nouvelles méthodes pour les APIs MongoDB

  // GET /api/vehicle_brands
  getVehicleBrands(): Observable<VehicleBrand[]> {
    return this.http.get<VehicleBrand[]>(`${this.apiUrl}/vehicle_brands`);
  }

  // GET /api/vehicle_models/:brandId
  getVehicleModels(brandId: string): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(`${this.apiUrl}/vehicle_models/${brandId}`);
  }

  // GET /api/vehicle_variants/:modelId
  getVehicleVariants(modelId: string): Observable<VehicleVariant[]> {
    return this.http.get<VehicleVariant[]>(`${this.apiUrl}/vehicle_variants/${modelId}`);
  }

  // GET /api/vehicle_engines/:variantId
  getVehicleEngines(variantId: string): Observable<VehicleEngine[]> {
    return this.http.get<VehicleEngine[]>(`${this.apiUrl}/vehicle_engines/${variantId}`);
  }
}