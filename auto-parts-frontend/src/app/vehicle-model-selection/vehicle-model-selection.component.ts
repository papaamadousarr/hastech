import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

interface VehicleDetail {
  brand: string;
  model_name?: string;
  model_variant?: string;
  Engine_types?: string;
  image_url: string;
}

interface EngineType {
  name: string;
  power: string;
}

@Component({
  selector: 'app-vehicle-model-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './vehicle-model-selection.component.html',
  styles: [`
    .appearance-none {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L10 12L14 8" stroke="%23666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      background-size: 1.5em 1.5em;
    }
  `]
})
export class VehicleModelSelectionComponent implements OnInit {
  selectedBrand: string = '';
  selectedModel: string | null = null;
  selectedVariant: VehicleDetail | null = null;
  models: { name: string; image_url: string }[] = [];
  variants: VehicleDetail[] = [];
  engineTypes: EngineType[] = [];
  brandLogo: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedBrand = params['brand']?.toLowerCase();
      this.loadVehicleData();
    });
  }
  parseInt(value: string): number {
    return parseInt(value);
  }
  loadVehicleData() {
    this.loading = true;
    this.http.get<VehicleDetail[]>('assets/data/vehicle_details.json')
      .pipe(
        map(data => {
          const brandInfo = data.find(item => 
            item.brand.toLowerCase() === this.selectedBrand && !item.model_name
          );
          this.brandLogo = brandInfo?.image_url || '';

          const uniqueModels = data
            .filter(item => 
              item.brand.toLowerCase() === this.selectedBrand && 
              item.model_name &&
              !item.model_variant
            )
            .map(item => ({
              name: item.model_name!,
              image_url: item.image_url
            }));

          return uniqueModels;
        })
      )
      .subscribe({
        next: (models) => {
          this.models = models;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load vehicle data';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  onModelSelect(modelName: string) {
    this.selectedModel = modelName;
    this.selectedVariant = null;
    this.engineTypes = [];
    
    this.http.get<VehicleDetail[]>('assets/data/vehicle_details.json')
      .pipe(
        map(data => data.filter(item => 
          item.brand.toLowerCase() === this.selectedBrand &&
          item.model_name === modelName &&
          item.model_variant
        ))
      )
      .subscribe({
        next: (variants) => {
          this.variants = variants;
        },
        error: (err) => {
          console.error('Error loading variants:', err);
        }
      });
  }

  onVariantSelect(variant: VehicleDetail) {
    this.selectedVariant = variant;
    if (variant.Engine_types) {
      // Parse engine types string into structured data
      this.engineTypes = variant.Engine_types.split(';').map(engine => {
        const [name, power] = engine.split('(');
        return {
          name: name.trim(),
          power: power ? `(${power.trim()}`  : ''
        };
      });
    }
  }

  onEngineSelect(engine: EngineType) {
    if (this.selectedVariant) {
      console.log('Selected engine:', engine);
      // Proceed with navigation or other logic
    } else {
      console.error('No variant selected');
    }
  }

  goBack() {
    if (this.selectedVariant) {
      this.selectedVariant = null;
      this.engineTypes = [];
    } else if (this.selectedModel) {
      this.selectedModel = null;
      this.variants = [];
    } else {
      this.router.navigate(['/']);
    }
  }

  getYearsFromVariant(variant: string): string {
    const match = variant.match(/\((.*?)\)/g);
    return match ? match[match.length - 1].replace(/[()]/g, '') : '';
  }
}