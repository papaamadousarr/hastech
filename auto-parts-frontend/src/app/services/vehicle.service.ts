import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}