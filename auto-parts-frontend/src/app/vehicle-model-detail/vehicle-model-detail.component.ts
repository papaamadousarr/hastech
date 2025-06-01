import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface VehicleDetail {
  brand: string;
  model_name?: string;
  model_variant?: string;
  Engine_types?: string;
  image_url: string;
  years?: string;
}

interface EngineType {
  name: string;
  power: string;
}

@Component({
  selector: 'app-vehicle-model-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './vehicle-model-detail.component.html',
  styleUrls: ['./vehicle-model-detail.component.css']
})
export class VehicleModelDetailComponent implements OnInit {
  selectedBrand: string = '';
  selectedModel: string = '';
  selectedVariant: VehicleDetail | null = null;
  variants: VehicleDetail[] = [];
  engineTypes: EngineType[] = [];
  brandLogo: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedBrand = params['brand']?.toLowerCase();
      this.selectedModel = params['model'];
      this.loadVehicleData();
    });
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

          return data.filter(item => 
            item.brand.toLowerCase() === this.selectedBrand &&
            item.model_name === this.selectedModel &&
            item.model_variant
          );
        })
      )
      .subscribe({
        next: (variants) => {
          this.variants = variants;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load vehicle data';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  onVariantSelect(variant: VehicleDetail) {
    this.selectedVariant = variant;
    if (variant.Engine_types) {
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

  getYearsFromVariant(variant: string): string {
    const match = variant.match(/\((.*?)\)/g);
    return match ? match[match.length - 1].replace(/[()]/g, '') : '';
  }
}
