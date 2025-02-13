import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { VehicleDetails } from '../interfaces/product-category.interface';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  link?: string;
}

interface VehicleInfo {
  brand: string;
  model: string;
  engine: string;
  year?: string;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  vehicleInfo: VehicleInfo | null = null;
  selectedCategory: string = '';
  searchQuery: string = '';
  error: string | null = null;
  loading = false;
  //vehicle?: VehicleImage;
  //loading = false;
  //imagePath: string = '';
  //vehicleImage: string = '';


  categories = [
    {
      id: 'filters',
      name: 'Filters',
      icon: 'assets/icons/filter-icon.png',
      subcategories: [
        { id: 'air-filter', name: 'Air Filter' },
        { id: 'pollen-filter', name: 'Pollen Filter' },
        { id: 'oil-filter', name: 'Oil Filter' },
        { id: 'fuel-filter', name: 'Fuel Filter' },
        { id: 'oil-drain-plug', name: 'Oil Drain Plug' }
      ]
    },
    {
      id: 'oils',
      name: 'Oils and Fluids',
      icon: 'https://bcdn.aloparca.com/category/image/01J7ATK5G0KQF8RVWG7NZ4YR76.png',
      subcategories: [
        { id: 'engine-oil', name: 'Engine Oil' }
      ]
    },
    {
      id: 'brakes',
      name: 'Brakes',
      icon: 'https://bcdn.aloparca.com/category/image/10103.png',
      subcategories: [
        { id: 'brake-disc', name: 'Brake Disc' },
        { id: 'brake-pad', name: 'Brake Pad' },
        { id: 'brake-pad-sensor', name: 'Brake Pad Sensor Cable' },
        { id: 'abs-sensor', name: 'ABS Sensor' },
        { id: 'brake-switch', name: 'Brake Switch' },
        { id: 'reverse-gear-switch', name: 'Reverse Gear Switch' },
        { id: 'brake-vacuum-pump', name: 'Brake Vacuum Pump' },
        { id: 'brake-caliper', name: 'Brake Caliper' },
        { id: 'brake-master-cylinder', name: 'Brake Master Cylinder' },
        { id: 'brake-hose', name: 'Brake Hose' },
        { id: 'handbrake-cable', name: 'Handbrake Cable' },
        { id: 'tire-pressure-sensor', name: 'Tire Pressure Sensor' }
      ]
    },
    {
      id: 'ignition',
      name: 'Ignition System',
      icon: 'https://bcdn.aloparca.com/category/image/10354.png',
      subcategories: [
        { id: 'glow-plug', name: 'Glow Plug' }
      ]
    },
    {
      id: 'suspension',
      name: 'Suspension',
      icon: 'https://bcdn.aloparca.com/category/image/10113.png',
      subcategories: [
        { id: 'shock-absorber', name: 'Shock Absorber' },
        { id: 'strut-mount-bearing', name: 'Strut Mount and Bearing' },
        { id: 'shock-boot', name: 'Shock Absorber Boot and Buffer' },
        { id: 'shock-bearing', name: 'Shock Absorber Bearing' },
        { id: 'sway-bar-bush', name: 'Sway Bar Bush' },
        { id: 'complete-axle', name: 'Complete Axle' },
        { id: 'subframe-bush', name: 'Subframe Bush' },
        { id: 'strut-top-mount', name: 'Strut Top Mount' },
        { id: 'axle-carrier', name: 'Axle Carrier' },
        { id: 'tie-rod-end', name: 'Tie Rod End' },
        { id: 'ball-joint', name: 'Ball Joint and Control Arm' },
        { id: 'axle-carrier-complete', name: 'Axle Carrier Complete' },
        { id: 'control-arm-bush', name: 'Control Arm Bush' },
        { id: 'cv-joint-boot', name: 'CV Joint Boot' },
        { id: 'wheel-hub-bearing', name: 'Wheel Hub and Bearing' },
        { id: 'control-arm', name: 'Control Arm' },
        { id: 'sway-bar-link', name: 'Sway Bar Link' },
        { id: 'steering-rack', name: 'Steering Rack' }
      ]
    },
    {
      id: 'clutch',
      name: 'Clutch',
      icon: 'https://bcdn.aloparca.com/category/image/10106.png',
      subcategories: [
        { id: 'flywheel-bolt-bearing', name: 'Flywheel Bolt and Bearing' },
        { id: 'clutch-set', name: 'Clutch Set' },
        { id: 'clutch-central-bearing', name: 'Clutch Central and Bearing' },
        { id: 'flywheel', name: 'Flywheel' }
      ]
    },
    {
      id: 'timing',
      name: 'Timing Chain and Bearing',
      icon: 'https://bcdn.aloparca.com/category/image/10107.png',
      subcategories: [
        { id: 'timing-chain', name: 'Timing Chain' },
        { id: 'timing-chain-set', name: 'Timing Chain Set' },
        { id: 'timing-tensioner', name: 'Timing Tensioner Bearing' },
        { id: 'v-belt-tensioner', name: 'V-Belt Tensioner Bearing' },
        { id: 'v-belt', name: 'V-Belt' },
        { id: 'oil-pump-chain-set', name: 'Oil Pump Chain Set' },
        { id: 'oil-pump-chain', name: 'Oil Pump Chain' }
      ]
    },
    {
      id: 'fuel',
      name: 'Fuel System',
      icon: 'https://bcdn.aloparca.com/category/image/10108.png',
      subcategories: [
        { id: 'injector', name: 'Injector' },
        { id: 'throttle-body', name: 'Throttle Body' },
        { id: 'egr-valve', name: 'EGR Valve' },
        { id: 'fuel-hose', name: 'Fuel Hose' },
        { id: 'air-filter-box', name: 'Air Filter Box and Parts' },
        { id: 'egr-cooler', name: 'EGR Cooler' }
      ]
    },
    {
      id: 'transmission',
      name: 'Transmission',
      icon: 'https://bcdn.aloparca.com/category/image/10109.png',
      subcategories: [
        { id: 'transmission-mount', name: 'Transmission Mount' },
        { id: 'drive-shaft-mount', name: 'Drive Shaft Mount' },
        { id: 'seal', name: 'Seal' },
        { id: 'reverse-gear-switch', name: 'Reverse Gear Switch' }
      ]
    },
    {
      id: 'lighting',
      name: 'Lighting',
      icon: 'https://bcdn.aloparca.com/category/image/10110.png',
      subcategories: [
        { id: 'license-plate-light', name: 'License Plate Light' },
        { id: 'headlight', name: 'Headlight' },
        { id: 'tail-light', name: 'Tail Light' },
        { id: 'rear-view-mirror', name: 'Rear View Mirror' },
        { id: 'bulb', name: 'Bulb' },
        { id: 'mirror-glass', name: 'Mirror Glass' }
      ]
    },
    {
      id: 'engine',
      name: 'Engine',
      icon: 'https://bcdn.aloparca.com/category/image/10111.png',
      subcategories: [
        { id: 'valve-guide', name: 'Valve Guide and Seat' },
        { id: 'connecting-rod-bearing', name: 'Connecting Rod Bearing' },
        { id: 'rocker-cover-gasket', name: 'Rocker Cover Gasket' },
        { id: 'manifold', name: 'Manifold' },
        { id: 'main-bearing', name: 'Main Bearing' },
        { id: 'turbo-hose-gasket', name: 'Turbo Hose and Gasket' },
        { id: 'camshaft-sensor', name: 'Camshaft Position Sensor' },
        { id: 'crankshaft-pulley', name: 'Crankshaft Pulley' },
        { id: 'oil-pressure-switch', name: 'Oil Pressure Switch' },
        { id: 'cylinder-head', name: 'Cylinder Head' },
        { id: 'engine-mount', name: 'Engine Mount' },
        { id: 'air-hose', name: 'Air Hose' },
        { id: 'map-sensor', name: 'MAP Sensor' },
        { id: 'gasket-set', name: 'Gasket Set' },
        { id: 'rocker-cover', name: 'Rocker Cover' },
        { id: 'crankshaft-gear', name: 'Crankshaft Gear' },
        { id: 'head-gasket', name: 'Cylinder Head Gasket' },
        { id: 'crankshaft-sensor', name: 'Crankshaft Sensor' },
        { id: 'turbocharger', name: 'Turbocharger' },
        { id: 'valve-stem-seal', name: 'Valve Stem Seal' },
        { id: 'oil-pan-gasket', name: 'Oil Pan Gasket' },
        { id: 'manifold-gasket', name: 'Manifold Gasket' },
        { id: 'crankshaft-seal', name: 'Crankshaft Seal' },
        { id: 'oil-pump', name: 'Oil Pump' },
        { id: 'engine-oil-cooler', name: 'Engine Oil Cooler' },
        { id: 'cylinder-head-bolt', name: 'Cylinder Head Bolt' },
        { id: 'mass-air-flow-sensor', name: 'Mass Air Flow Sensor' }
      ]
    },
    {
      id: 'steering',
      name: 'Steering',
      icon: 'https://bcdn.aloparca.com/category/image/10112.png',
      subcategories: [
        { id: 'steering-pump', name: 'Steering Pump' },
        { id: 'steering-boot', name: 'Steering Boot' }
      ]
    },
    {
      id: 'body',
      name: 'Body Parts',
      icon: 'https://bcdn.aloparca.com/category/image/10101.png',
      subcategories: [
        { id: 'wiper-blade', name: 'Wiper Blade' },
        { id: 'rear-view-mirror', name: 'Rear View Mirror' },
        { id: 'mirror-glass', name: 'Mirror Glass' },
        { id: 'sliding-door-roller', name: 'Sliding Door Roller' }
      ]
    },
    {
      id: 'cooling-heating',
      name: 'Cooling and Heating',
      icon: 'https://bcdn.aloparca.com/category/image/10104.png',
      subcategories: [
        { id: 'water-pump-hose', name: 'Water Pump Hose' },
        { id: 'ac-compressor', name: 'AC Compressor' },
        { id: 'ac-radiator', name: 'AC Radiator' },
        { id: 'thermostat', name: 'Thermostat' },
        { id: 'blower-motor', name: 'Blower Motor' },
        { id: 'expansion-tank', name: 'Radiator Expansion Tank' },
        { id: 'radiator-fan', name: 'Radiator Fan and Motor' },
        { id: 'intercooler', name: 'Intercooler' },
        { id: 'water-pump', name: 'Water Pump' },
        { id: 'thermostat-housing', name: 'Thermostat Housing' },
        { id: 'ac-pressure-switch', name: 'AC Pressure Switch' },
        { id: 'temperature-switch', name: 'Temperature Switch' },
        { id: 'radiator-hose', name: 'Radiator Hose' },
        { id: 'expansion-tank-cap', name: 'Expansion Tank Cap' },
        { id: 'heater-radiator', name: 'Heater Radiator' },
        { id: 'exhaust-temp-sensor', name: 'Exhaust Temperature Sensor' },
        { id: 'heater-hose', name: 'Heater Hose' }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: 'https://bcdn.aloparca.com/category/image/10105.png',
      subcategories: [
        { id: 'alternator', name: 'Alternator' },
        { id: 'washer-pump', name: 'Washer Pump' },
        { id: 'starter-motor', name: 'Starter Motor' },
        { id: 'alternator-pulley', name: 'Alternator Pulley' },
        { id: 'relay-flasher', name: 'Relay and Flasher' },
        { id: 'ambient-temp-sensor', name: 'Ambient Temperature Sensor' }
      ]
    }
  ];

  products: any[] = [];
  errorMessage = '';
  selectedSubcategory: any = null;
  searchParams: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['brand'] && params['model']) {
        this.vehicleInfo = {
          brand: params['brand'],
          model: params['model'],
          engine: params['engine'] || ''
        };
        this.loadPartsForVehicle();
      }
    });
  }

  private loadCategories() {
    this.productService.getMainCategories()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading categories';
          console.error('Error:', error);
          return of([]);
        })
      )
      .subscribe(categories => {
        this.categories = categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.imageUrl,
          subcategories: []
        }));
      });
  }

  private loadPartsForVehicle() {
    if (this.vehicleInfo) {
      this.loading = true;
      this.productService.getProductsByVehicle(this.vehicleInfo.brand, this.vehicleInfo.model, this.vehicleInfo.engine)
        .pipe(
          catchError(error => {
            this.errorMessage = 'Error loading products';
            console.error('Error:', error);
            return of([]);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(products => {
          this.products = products;
        });
    }
  }

  onCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.loadSubcategories(categoryId);
  }

  private loadSubcategories(categoryId: string) {
    this.productService.getSubCategories(categoryId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading subcategories';
          console.error('Error:', error);
          return of([]);
        })
      )
      .subscribe(subcategories => {
        const category = this.categories.find(c => c.id === this.selectedCategory);
        if (category) {
          category.subcategories = subcategories.map(sub => ({
            id: sub.id,
            name: sub.name
          }));
        }
      });
  }

  getVehicleImage(): string {
    if (!this.vehicleInfo?.brand || !this.vehicleInfo?.model) {
        return 'https://bcdn.aloparca.com/model_series_cars_photo/10266.jpg?width=192'; // Return default image path until we have a better solution
    }

    // Initialize a variable to hold the image path
    let imagePath: string = '';

    // Subscribe to the observable to get the image path
    this.productService.getModelImage(this.vehicleInfo.brand, this.vehicleInfo.model)
        .subscribe(image => {
            imagePath = image; // Assign the image path to the variable
        });

    return imagePath; // This will return an empty string initially
  }

  onSubcategorySelect(categoryId: string, subcategoryId: string) {
    // Navigate to parts list for this subcategory
    this.router.navigate(['/parts'], {
      queryParams: {
        ...this.vehicleInfo,
        category: categoryId,
        subcategory: subcategoryId
      }
    });
  }

  onSearchParts(event: Event) {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      // Navigate to search results with current vehicle info and search query
      this.router.navigate(['/parts/search'], {
        queryParams: {
          ...this.vehicleInfo,
          q: this.searchQuery
        }
      });
    }
  }

  changeVehicle() {
    // Navigate back to vehicle selection
    this.productService.clearVehicleSelection();
    this.router.navigate(['/']);
  }

  showVehicleDetails() {
    // Navigate to vehicle details page
    this.router.navigate(['/vehicle-details'], {
      queryParams: this.vehicleInfo
    });
  }

  // Helper method to get brand display name
  getBrandDisplayName(brandId: string): string {
    // Add logic to convert brand ID to display name if needed
    return brandId.replace('_', ' ');
  }

  // Helper method to get model display name
  getModelDisplayName(modelId: string): string {
    // Add logic to convert model ID to display name if needed
    return modelId.replace('_', ' ');
  }

  // Helper method to get engine display name
  getEngineDisplayName(engineId: string): string {
    // Add logic to convert engine ID to display name if needed
    return engineId.replace('_', ' ');
  }

  onCategoryClick(categoryId: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.searchParams, category: categoryId },
      queryParamsHandling: 'merge'
    });
  }
}