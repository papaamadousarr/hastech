import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { VehicleBrand, VehicleModel, VehicleVariant, VehicleEngine } from '../interfaces/vehicle.interface';

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
  selectedBrand: VehicleBrand | null = null;
  selectedModel: VehicleModel | null = null;
  selectedVariant: VehicleVariant | null = null;
  selectedEngine: VehicleEngine | null = null;
  
  models: VehicleModel[] = [];
  variants: VehicleVariant[] = [];
  engines: VehicleEngine[] = [];
  
  loading: boolean = true;
  error: string | null = null;
  showAllModels = false;
  modelsPerRow = 4;

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const brandId = params['brandId'];
      if (brandId) {
        this.loadBrandAndModels(brandId);
      }
    });
  }

  loadBrandAndModels(brandId: string) {
    this.loading = true;
    this.error = null;

    // Charger d'abord la marque pour avoir ses informations
    this.vehicleService.getVehicleBrands().subscribe({
      next: (brands) => {
        this.selectedBrand = brands.find(b => b._id === brandId) || null;
        if (this.selectedBrand) {
          this.loadModels(brandId);
        } else {
          this.error = 'Brand not found';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading brand:', err);
        this.error = 'Failed to load brand information';
        this.loading = false;
      }
    });
  }

  loadModels(brandId: string) {
    this.vehicleService.getVehicleModels(brandId).subscribe({
      next: (models) => {
        this.models = models?.filter(model => model.isActive) || [];
          this.loading = false;
        },
        error: (err) => {
        console.error('Error loading models:', err);
        this.error = 'Failed to load vehicle models';
          this.loading = false;
        }
      });
  }

  onModelSelect(model: VehicleModel) {
    this.selectedModel = model;
    this.selectedVariant = null;
    this.selectedEngine = null;
    this.engines = [];
    
    this.loadVariants(model._id);
  }

  loadVariants(modelId: string) {
    this.vehicleService.getVehicleVariants(modelId).subscribe({
        next: (variants) => {
        this.variants = variants?.filter(variant => variant.isActive) || [];
        },
        error: (err) => {
          console.error('Error loading variants:', err);
        this.variants = [];
        }
      });
  }

  onVariantSelect(variant: VehicleVariant) {
    this.selectedVariant = variant;
    this.selectedEngine = null;
    
    this.loadEngines(variant._id);
  }

  loadEngines(variantId: string) {
    this.vehicleService.getVehicleEngines(variantId).subscribe({
      next: (engines) => {
        this.engines = engines?.filter(engine => engine.isActive) || [];
      },
      error: (err) => {
        console.error('Error loading engines:', err);
        this.engines = [];
      }
    });
  }

  onEngineSelect(engine: VehicleEngine) {
    this.selectedEngine = engine;
    console.log('Selected engine:', engine);
    
    // Ici tu peux naviguer vers la page de recherche de produits
    // avec les paramètres de véhicule sélectionnés
    this.searchProductsWithVehicle();
  }

  searchProductsWithVehicle() {
    console.log('searchProductsWithVehicle called');
    console.log('Selected brand:', this.selectedBrand);
    console.log('Selected model:', this.selectedModel);
    console.log('Selected variant:', this.selectedVariant);
    console.log('Selected engine:', this.selectedEngine);
    
    if (this.selectedBrand && this.selectedModel && this.selectedVariant && this.selectedEngine) {
      const params = {
        brand: this.selectedBrand.name,
        model: this.selectedModel.name,
        variant: this.selectedVariant.name,
        engine: this.selectedEngine.name,
        brandId: this.selectedBrand._id,
        modelId: this.selectedModel._id,
        variantId: this.selectedVariant._id,
        engineId: this.selectedEngine._id
      };
      
      console.log('Navigating to search-results with params:', params);
      
      // Naviguer vers la page de recherche avec les paramètres
      this.router.navigate(['/search-results'], { queryParams: params });
    } else {
      console.error('Missing vehicle information for search');
      alert('Please select all vehicle information before searching for parts');
    }
  }

  goBack() {
    if (this.selectedEngine) {
      this.selectedEngine = null;
      this.engines = [];
    } else if (this.selectedVariant) {
      this.selectedVariant = null;
      this.variants = [];
    } else if (this.selectedModel) {
      this.selectedModel = null;
      this.variants = [];
    } else {
      this.router.navigate(['/']);
    }
  }

  get visibleModels() {
    if (this.showAllModels) return this.models;
    return this.models.slice(0, this.modelsPerRow * 2); // 2 rows
  }

  showMoreModels() {
    this.showAllModels = true;
  }
}