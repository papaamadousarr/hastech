// vehicle-search.component.ts
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, VehicleModel } from '../services/product.service';
import { HttpClient } from '@angular/common/http';

interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface Model {
  id: string;
  name: string;
  years: string;
}

interface VehicleEngine {
  id: string;
  name: string;
  power: string;
}

@Component({
  selector: 'app-vehicle-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.css']
})
export class VehicleSearchComponent implements OnInit, OnChanges {
  @Output() searchComplete = new EventEmitter<any>();
  @Input() brand: string = '';

  selectedBrand: string = '';
  selectedModel: string = '';
  selectedEngine: string = '';

  brands: Brand[] = [];
  modelsByBrand: { [brand: string]: Model[] } = {};
  enginesByModel: { [model: string]: VehicleEngine[] } = {};

  vehicleData: any[] = [];

  models: Model[] = [];
  engines: VehicleEngine[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['brand'] && changes['brand'].currentValue) {
      this.selectedBrand = changes['brand'].currentValue.toUpperCase();
      this.onBrandSelect();
    }
  }

  ngOnInit() {
    if (this.brand) {
      this.selectedBrand = this.brand.toUpperCase();
      this.onBrandSelect();
    }

    this.http.get<any[]>('assets/data/vehicle_details.json').subscribe(data => {
      this.vehicleData = data;
      this.buildBrandModelEngineMaps();
    });
  }

  buildBrandModelEngineMaps() {
    // Extract unique brands with their logos
    const brandMap = new Map<string, Brand>();
    for (const vehicle of this.vehicleData) {
      // Only add if not already present and has a logo/image_url
      if (vehicle.brand && vehicle.image_url && !brandMap.has(vehicle.brand)) {
        brandMap.set(vehicle.brand, {
          id: vehicle.brand,
          name: vehicle.brand.charAt(0).toUpperCase() + vehicle.brand.slice(1), // Capitalize
          logo: vehicle.image_url
        });
      }
    }
    this.brands = Array.from(brandMap.values());
  }

  onBrandSelect() {
    this.selectedModel = '';
    this.selectedEngine = '';
    this.engines = [];

    if (this.selectedBrand) {
      // Filter vehicleData for the selected brand and entries with a model_name
      const modelsSet = new Set<string>();
      const models: Model[] = [];

      for (const vehicle of this.vehicleData) {
        if (
          vehicle.brand &&
          vehicle.model_name &&
          vehicle.brand.toLowerCase() === this.selectedBrand.toLowerCase() &&
          !modelsSet.has(vehicle.model_name)
        ) {
          modelsSet.add(vehicle.model_name);
          models.push({
            id: vehicle.model_name,
            name: vehicle.model_name,
            years: vehicle.model_years || '' // Use years if available, else empty
          });
        }
      }
      this.models = models;
    } else {
      this.models = [];
    }
  }

  onModelSelect() {
    this.selectedEngine = '';

    if (this.selectedModel) {
      this.enginesByModel = this.vehicleData.reduce((acc, vehicle) => {
        if (!acc[vehicle.model]) {
          acc[vehicle.model] = [];
        }
        acc[vehicle.model].push({
          id: vehicle.engine,
          name: vehicle.engine,
          power: vehicle.power
        });
        return acc;
      }, {} as { [key: string]: VehicleEngine[] });

      this.engines = this.enginesByModel[this.selectedModel] || [];
    }
  }

  onSearch() {
    if (this.selectedBrand && this.selectedModel && this.selectedEngine) {
      this.router.navigate(['/search-results'], {
        queryParams: {
          brand: this.selectedBrand,
          model: this.selectedModel,
          engine: this.selectedEngine
        }
      });
    }
  }
}