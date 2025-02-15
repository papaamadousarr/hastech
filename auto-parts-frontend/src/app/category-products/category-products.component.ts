import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { VehicleSearchComponent } from '../vehicle-search/vehicle-search.component';

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  partNumber: string;
  price: number;
  inStock: boolean;
  url: string;
  image: string;
  brand: string;
  brandSlug: string;
  brandLogo: string;
  specifications: Specification[];
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  isOpen?: boolean;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | '';
type FilterOption = 'in_stock' | 'out_stock' | '';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterModule, VehicleSearchComponent],
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  categoryId: string = '';
  categoryName: string = '';
  products: Product[] = [];
  loading: boolean = true;
  filteredProducts: Product[] = [];
  
  // Sorting and filtering
  sortBy: SortOption = '';
  filterBy: FilterOption = '';
  
  // Using the same categories as search-results
  categories: Category[] = [
    {
      id: 'filters',
      name: 'Filters',
      icon: '/assets/images/category/icons/filters.png',
      isOpen: false,
      subcategories: [
        { id: 'air-filter', name: 'Air Filter', url: '/filters/air-filter', icon: '/assets/images/category/icons/air-filter.png' },
        { id: 'pollen-filter', name: 'Pollen Filter', url: '/filters/pollen-filter', icon: '/assets/images/category/icons/pollen-filter.png' },
        { id: 'oil-filter', name: 'Oil Filter', url: '/filters/oil-filter', icon: '/assets/images/category/icons/oil-filter.png' },
        { id: 'fuel-filter', name: 'Fuel Filter', url: '/filters/fuel-filter', icon: '/assets/images/category/icons/fuel-filter.png' },
        { id: 'oil-drain-plug', name: 'Oil Drain Plug', url: '/filters/oil-drain-plug', icon: '/assets/images/category/icons/oil-drain-plug.png' }
      ]
    },
    {
      id: 'oils',
      name: 'Oils and Fluids',
      icon: '/assets/images/category/icons/fluids.png',
      isOpen: false,
      subcategories: [
        { id: 'engine-oil', name: 'Engine Oil', url: '/oils/engine-oil', icon: '/assets/images/category/icons/engine-oil.png' }
      ]
    },
    {
      id: 'brakes',
      name: 'Brakes',
      icon: '/assets/images/category/icons/brakesystem.png',
      isOpen: false,
      subcategories: [
        { id: 'brake-disc', name: 'Brake Disc', url: '/brakes/brake-disc', icon: '/assets/images/category/icons/brake-disc.png' },
        { id: 'brake-pad', name: 'Brake Pad', url: '/brakes/brake-pad', icon: '/assets/images/category/icons/brake-pad.png' },
        { id: 'brake-pad-sensor', name: 'Brake Pad Sensor Cable', url: '/brakes/brake-pad-sensor',  icon: '/assets/images/category/icons/brake-pad-sensor.png' },
        { id: 'abs-sensor', name: 'ABS Sensor', url: '/brakes/abs-sensor', icon: '/assets/images/category/icons/abs-sensor.png' },
        { id: 'brake-switch', name: 'Brake Switch', url: '/brakes/brake-switch', icon: '/assets/images/category/icons/brake-switch.png' },
        { id: 'reverse-gear-switch', name: 'Reverse Gear Switch', url: '/brakes/reverse-gear-switch', icon: '/assets/images/category/icons/reverse-gear-switch.png' },
        { id: 'brake-vacuum-pump', name: 'Brake Vacuum Pump', url: '/brakes/brake-vacuum-pump', icon: '/assets/images/category/icons/brake-vacuum-pump.png' },
        { id: 'brake-caliper', name: 'Brake Caliper', url: '/brakes/brake-caliper', icon: '/assets/images/category/icons/brake-caliper.png' },
        { id: 'brake-master-cylinder', name: 'Brake Master Cylinder', url: '/brakes/brake-master-cylinder', icon: '/assets/images/category/icons/brake-master-cylinder.png' },
        { id: 'brake-hose', name: 'Brake Hose', url: '/brakes/brake-hose', icon: '/assets/images/category/icons/brake-hose.png' },
        { id: 'handbrake-cable', name: 'Handbrake Cable', url: '/brakes/handbrake-cable', icon: '/assets/images/category/icons/handbrake-cable.png' },
        { id: 'tire-pressure-sensor', name: 'Tire Pressure Sensor', url: '/brakes/tire-pressure-sensor', icon: '/assets/images/category/icons/tire-pressure-sensor.png' }
      ]
    },
    {
      id: 'ignition',
      name: 'Ignition System',
      icon: '/assets/images/category/icons/ignition.png',
      isOpen: false,
      subcategories: [
        { id: 'glow-plug', name: 'Glow Plug', url: '/ignition/glow-plug', icon: '/assets/images/category/icons/glow-plug.png' }
      ]
    },
    {
      id: 'suspension',
      name: 'Suspension',
      icon: '/assets/images/category/icons/suspension.png',
      isOpen: false,
      subcategories: [
        { id: 'shock-absorber', name: 'Shock Absorber', url: '/suspension/shock-absorber', icon: '/assets/images/category/icons/shock-absorber.png' },
        { id: 'strut-mount-bearing', name: 'Strut Mount and Bearing', url: '/suspension/strut-mount-bearing', icon: '/assets/images/category/icons/strut-mount-bearing.png' },
        { id: 'shock-boot', name: 'Shock Absorber Boot and Buffer', url: '/suspension/shock-boot', icon: '/assets/images/category/icons/shock-boot.png' },
        { id: 'shock-bearing', name: 'Shock Absorber Bearing', url: '/suspension/shock-bearing' },
        { id: 'sway-bar-bush', name: 'Sway Bar Bush', url: '/suspension/sway-bar-bush', icon: '/assets/images/category/icons/sway-bar-bush.png' },
        { id: 'complete-axle', name: 'Complete Axle', url: '/suspension/complete-axle', icon: '/assets/images/category/icons/complete-axle.png' },
        { id: 'subframe-bush', name: 'Subframe Bush', url: '/suspension/subframe-bush', icon: '/assets/images/category/icons/subframe-bush.png' },
        { id: 'strut-top-mount', name: 'Strut Top Mount', url: '/suspension/strut-top-mount', icon: '/assets/images/category/icons/strut-top-mount.png' },
        { id: 'axle-carrier', name: 'Axle Carrier', url: '/suspension/axle-carrier', icon: '/assets/images/category/icons/axle-carrier.png' },
        { id: 'tie-rod-end', name: 'Tie Rod End', url: '/suspension/tie-rod-end', icon: '/assets/images/category/icons/tie-rod-end.png' },
        { id: 'ball-joint', name: 'Ball Joint and Control Arm', url: '/suspension/ball-joint', icon: '/assets/images/category/icons/ball-joint.png' },
        { id: 'axle-carrier-complete', name: 'Axle Carrier Complete', url: '/suspension/axle-carrier-complete', icon: '/assets/images/category/icons/axle-carrier-complete.png' },
        { id: 'control-arm-bush', name: 'Control Arm Bush', url: '/suspension/control-arm-bush', icon: '/assets/images/category/icons/control-arm-bush.png' },
        { id: 'cv-joint-boot', name: 'CV Joint Boot', url: '/suspension/cv-joint-boot', icon: '/assets/images/category/icons/cv-joint-boot.png' },
        { id: 'wheel-hub-bearing', name: 'Wheel Hub and Bearing', url: '/suspension/wheel-hub-bearing', icon: '/assets/images/category/icons/wheel-hub-bearing.png' },
        { id: 'control-arm', name: 'Control Arm', url: '/suspension/control-arm', icon: '/assets/images/category/icons/control-arm.png' },
        { id: 'sway-bar-link', name: 'Sway Bar Link', url: '/suspension/sway-bar-link', icon: '/assets/images/category/icons/sway-bar-link.png'  },
        { id: 'steering-rack', name: 'Steering Rack', url: '/suspension/steering-rack', icon: '/assets/images/category/icons/steering-rack.png' }
      ]
    },
    {
      id: 'clutch',
      name: 'Clutch',
      icon: '/assets/images/category/icons/clutch.png',
      isOpen: false,
      subcategories: [
        { id: 'flywheel-bolt-bearing', name: 'Flywheel Bolt and Bearing', url: '/clutch/flywheel-bolt-bearing', icon: '/assets/images/category/icons/flywheel-bolt-bearing.png' },
        { id: 'clutch-set', name: 'Clutch Set', url: '/clutch/clutch-set', icon: '/assets/images/category/icons/clutch-set.png' },
        { id: 'clutch-central-bearing', name: 'Clutch Central and Bearing', url: '/clutch/clutch-central-bearing', icon: '/assets/images/category/icons/clutch-central-bearing.png' },
        { id: 'flywheel', name: 'Flywheel', url: '/clutch/flywheel', icon: '/assets/images/category/icons/flywheel.png' }
      ]
    },
    {
      id: 'timing',
      name: 'Timing Chain and Bearing',
      icon: '/assets/images/category/icons/timing.png',
      isOpen: false,
      subcategories: [
        { id: 'timing-chain', name: 'Timing Chain', url: '/timing/timing-chain', icon: '/assets/images/category/icons/timing-chain.png' },
        { id: 'timing-chain-set', name: 'Timing Chain Set', url: '/timing/timing-chain-set', icon: '/assets/images/category/icons/timing-chain-set.png' },
        { id: 'timing-tensioner', name: 'Timing Tensioner Bearing', url: '/timing/timing-tensioner', icon: '/assets/images/category/icons/timing-tensioner.png' },
        { id: 'v-belt-tensioner', name: 'V-Belt Tensioner Bearing', url: '/timing/v-belt-tensioner', icon: '/assets/images/category/icons/v-belt-tensioner.png' },
        { id: 'v-belt', name: 'V-Belt', url: '/timing/v-belt', icon: '/assets/images/category/icons/v-belt.png'  },
        { id: 'oil-pump-chain-set', name: 'Oil Pump Chain Set', url: '/timing/oil-pump-chain-set', icon: '/assets/images/category/icons/oil-pump-chain-set.png'  },
        { id: 'oil-pump-chain', name: 'Oil Pump Chain', url: '/timing/oil-pump-chain', icon: '/assets/images/category/icons/oil-pump-chain.png' }
      ]
    },
    {
      id: 'fuel',
      name: 'Fuel System',
      icon: '/assets/images/category/icons/fuelsystem.png',
      isOpen: false,
      subcategories: [
        { id: 'injector', name: 'Injector', url: '/fuel/injector', icon: '/assets/images/category/icons/injector.png' },
        { id: 'throttle-body', name: 'Throttle Body', url: '/fuel/throttle-body', icon: '/assets/images/category/icons/throttle-body.png' },
        { id: 'egr-valve', name: 'EGR Valve', url: '/fuel/egr-valve', icon: '/assets/images/category/icons/egr-valve.png' },
        { id: 'fuel-hose', name: 'Fuel Hose', url: '/fuel/fuel-hose', icon: '/assets/images/category/icons/fuel-hose.png' },
        { id: 'air-filter-box', name: 'Air Filter Box and Parts', url: '/fuel/air-filter-box', icon: '/assets/images/category/icons/air-filter-box.png'  },
        { id: 'egr-cooler', name: 'EGR Cooler', url: '/fuel/egr-cooler', icon: '/assets/images/category/icons/egr-cooler.png' }
      ]
    },
    {
      id: 'transmission',
      name: 'Transmission',
      icon: '/assets/images/category/icons/transmission.png',
      isOpen: false,
      subcategories: [
        { id: 'transmission-mount', name: 'Transmission Mount', url: '/transmission/transmission-mount', icon: '/assets/images/category/icons/transmission-mount.png' },
        { id: 'drive-shaft-mount', name: 'Drive Shaft Mount', url: '/transmission/drive-shaft-mount', icon: '/assets/images/category/icons/drive-shaft-mount.png' },
        { id: 'seal', name: 'Seal', url: '/transmission/seal', icon: '/assets/images/category/icons/seal.png' },
        { id: 'reverse-gear-switch', name: 'Reverse Gear Switch', url: '/transmission/reverse-gear-switch', icon: '/assets/images/category/icons/reverse-gear-switch.png' }
      ]
    },
    {
      id: 'lighting',
      name: 'Lighting',
      icon: '/assets/images/category/icons/lightnings.png',
      isOpen: false,
      subcategories: [
        { id: 'license-plate-light', name: 'License Plate Light', url: '/lighting/license-plate-light', icon: '/assets/images/category/icons/license-plate-light.png' },
        { id: 'headlight', name: 'Headlight', url: '/lighting/headlight', icon: '/assets/images/category/icons/headlight.png'},
        { id: 'tail-light', name: 'Tail Light', url: '/lighting/tail-light', icon: '/assets/images/category/icons/tail-light.png' },
        { id: 'rear-view-mirror', name: 'Rear View Mirror', url: '/lighting/rear-view-mirror', icon: '/assets/images/category/icons/rear-view-mirror.png' },
        { id: 'bulb', name: 'Bulb', url: '/lighting/bulb', icon: '/assets/images/category/icons/bulb.png' },
        { id: 'mirror-glass', name: 'Mirror Glass', url: '/lighting/mirror-glass', icon: '/assets/images/category/icons/mirror-glass.png' }
      ]
    },
    {
      id: 'engine',
      name: 'Engine',
      icon: '/assets/images/category/icons/engines.png',
      isOpen: false,
      subcategories: [
        { id: 'valve-guide', name: 'Valve Guide and Seat', url: '/engine/valve-guide', icon: '/assets/images/category/icons/valve-guide.png' },
        { id: 'connecting-rod-bearing', name: 'Connecting Rod Bearing', url: '/engine/connecting-rod-bearing', icon: '/assets/images/category/icons/connecting-rod-bearing.png' },
        { id: 'rocker-cover-gasket', name: 'Rocker Cover Gasket', url: '/engine/rocker-cover-gasket', icon: '/assets/images/category/icons/rocker-cover-gasket.png' },
        { id: 'manifold', name: 'Manifold', url: '/engine/manifold', icon: '/assets/images/category/icons/manifold.png' },
        { id: 'main-bearing', name: 'Main Bearing', url: '/engine/main-bearing', icon: '/assets/images/category/icons/main-bearing.png'  },
        { id: 'turbo-hose-gasket', name: 'Turbo Hose and Gasket', url: '/engine/turbo-hose-gasket', icon: '/assets/images/category/icons/turbo-hose-gasket.png'  },
        { id: 'camshaft-sensor', name: 'Camshaft Position Sensor', url: '/engine/camshaft-sensor', icon: '/assets/images/category/icons/camshaft-sensor.png'     },
        { id: 'crankshaft-pulley', name: 'Crankshaft Pulley', url: '/engine/crankshaft-pulley', icon: '/assets/images/category/icons/crankshaft-pulley.png'  },
        { id: 'oil-pressure-switch', name: 'Oil Pressure Switch', url: '/engine/oil-pressure-switch', icon: '/assets/images/category/icons/oil-pressure-switch.png'  },
        { id: 'cylinder-head', name: 'Cylinder Head', url: '/engine/cylinder-head', icon: '/assets/images/category/icons/cylinder-head.png' },
        { id: 'engine-mount', name: 'Engine Mount', url: '/engine/engine-mount', icon: '/assets/images/category/icons/engine-mount.png' },
        { id: 'air-hose', name: 'Air Hose', url: '/engine/air-hose', icon: '/assets/images/category/icons/air-hose.png' },
        { id: 'map-sensor', name: 'MAP Sensor', url: '/engine/map-sensor', icon: '/assets/images/category/icons/map-sensor.png' },
        { id: 'gasket-set', name: 'Gasket Set', url: '/engine/gasket-set', icon: '/assets/images/category/icons/gasket-set.png' },
        { id: 'rocker-cover', name: 'Rocker Cover', url: '/engine/rocker-cover', icon: '/assets/images/category/icons/rocker-cover.png' },
        { id: 'crankshaft-gear', name: 'Crankshaft Gear', url: '/engine/crankshaft-gear', icon: '/assets/images/category/icons/crankshaft-gear.png'    },
        { id: 'head-gasket', name: 'Cylinder Head Gasket', url: '/engine/head-gasket', icon: '/assets/images/category/icons/head-gasket.png'     },
        { id: 'crankshaft-sensor', name: 'Crankshaft Sensor', url: '/engine/crankshaft-sensor', icon: '/assets/images/category/icons/crankshaft-sensor.png'  },
        { id: 'turbocharger', name: 'Turbocharger', url: '/engine/turbocharger', icon: '/assets/images/category/icons/turbocharger.png'    },
        { id: 'valve-stem-seal', name: 'Valve Stem Seal', url: '/engine/valve-stem-seal', icon: '/assets/images/category/icons/valve-stem-seal.png'  },
        { id: 'oil-pan-gasket', name: 'Oil Pan Gasket', url: '/engine/oil-pan-gasket', icon: '/assets/images/category/icons/oil-pan-gasket.png' },
        { id: 'manifold-gasket', name: 'Manifold Gasket', url: '/engine/manifold-gasket', icon: '/assets/images/category/icons/manifold-gasket.png' },
        { id: 'crankshaft-seal', name: 'Crankshaft Seal', url: '/engine/crankshaft-seal', icon: '/assets/images/category/icons/crankshaft-seal.png' },
        { id: 'oil-pump', name: 'Oil Pump', url: '/engine/oil-pump', icon: '/assets/images/category/icons/oil-pump.png' },
        { id: 'engine-oil-cooler', name: 'Engine Oil Cooler', url: '/engine/engine-oil-cooler', icon: '/assets/images/category/icons/engine-oil-cooler.png' },
        { id: 'cylinder-head-bolt', name: 'Cylinder Head Bolt', url: '/engine/cylinder-head-bolt', icon: '/assets/images/category/icons/cylinder-head-bolt.png' },
        { id: 'mass-air-flow-sensor', name: 'Mass Air Flow Sensor', url: '/engine/mass-air-flow-sensor', icon: '/assets/images/category/icons/mass-air-flow-sensor.png' }
      ]
    },
    {
      id: 'steering',
      name: 'Steering',
      icon: '/assets/images/category/icons/steering.png',
      isOpen: false,
      subcategories: [
        { id: 'steering-pump', name: 'Steering Pump', url: '/steering/steering-pump', icon: '/assets/images/category/icons/steering-pump.png' },
        { id: 'steering-boot', name: 'Steering Boot', url: '/steering/steering-boot', icon: '/assets/images/category/icons/steering-boot.png' }
      ]
    },
    {
      id: 'body',
      name: 'Body Parts',
      icon: '/assets/images/category/icons/bodyparts.png',
      isOpen: false,
      subcategories: [
        { id: 'wiper-blade', name: 'Wiper Blade', url: '/body/wiper-blade', icon: '/assets/images/category/icons/wiper-blade.png' },
        { id: 'rear-view-mirror', name: 'Rear View Mirror', url: '/body/rear-view-mirror', icon: '/assets/images/category/icons/rear-view-mirror.png' },
        { id: 'mirror-glass', name: 'Mirror Glass', url: '/body/mirror-glass', icon: '/assets/images/category/icons/mirror-glass.png' },
        { id: 'sliding-door-roller', name: 'Sliding Door Roller', url: '/body/sliding-door-roller', icon: '/assets/images/category/icons/sliding-door-roller.png' }
      ]
    },
    {
      id: 'cooling-heating',
      name: 'Cooling and Heating',
      icon: '/assets/images/category/icons/cooling.png',
      isOpen: false,
      subcategories: [
        { id: 'water-pump-hose', name: 'Water Pump Hose', url: '/cooling-heating/water-pump-hose', icon: '/assets/images/category/icons/water-pump-hose.png' },
        { id: 'ac-compressor', name: 'AC Compressor', url: '/cooling-heating/ac-compressor', icon: '/assets/images/category/icons/ac-compressor.png' },
        { id: 'ac-radiator', name: 'AC Radiator', url: '/cooling-heating/ac-radiator', icon: '/assets/images/category/icons/ac-radiator.png' },
        { id: 'thermostat', name: 'Thermostat', url: '/cooling-heating/thermostat', icon: '/assets/images/category/icons/thermostat.png' },
        { id: 'blower-motor', name: 'Blower Motor', url: '/cooling-heating/blower-motor', icon: '/assets/images/category/icons/blower-motor.png'   },
        { id: 'expansion-tank', name: 'Radiator Expansion Tank', url: '/cooling-heating/expansion-tank', icon: '/assets/images/category/icons/expansion-tank.png'  },
        { id: 'radiator-fan', name: 'Radiator Fan and Motor', url: '/cooling-heating/radiator-fan', icon: '/assets/images/category/icons/radiator-fan.png'   },
        { id: 'intercooler', name: 'Intercooler', url: '/cooling-heating/intercooler', icon: '/assets/images/category/icons/intercooler.png'   },
        { id: 'water-pump', name: 'Water Pump', url: '/cooling-heating/water-pump', icon: '/assets/images/category/icons/water-pump.png'   },
        { id: 'thermostat-housing', name: 'Thermostat Housing', url: '/cooling-heating/thermostat-housing', icon: '/assets/images/category/icons/thermostat-housing.png'   },
        { id: 'ac-pressure-switch', name: 'AC Pressure Switch', url: '/cooling-heating/ac-pressure-switch', icon: '/assets/images/category/icons/ac-pressure-switch.png'   },
        { id: 'temperature-switch', name: 'Temperature Switch', url: '/cooling-heating/temperature-switch', icon: '/assets/images/category/icons/temperature-switch.png'   },
        { id: 'radiator-hose', name: 'Radiator Hose', url: '/cooling-heating/radiator-hose', icon: '/assets/images/category/icons/radiator-hose.png'   },
        { id: 'expansion-tank-cap', name: 'Expansion Tank Cap', url: '/cooling-heating/expansion-tank-cap', icon: '/assets/images/category/icons/expansion-tank-cap.png'   },
        { id: 'heater-radiator', name: 'Heater Radiator', url: '/cooling-heating/heater-radiator', icon: '/assets/images/category/icons/heater-radiator.png'   },
        { id: 'exhaust-temp-sensor', name: 'Exhaust Temperature Sensor', url: '/cooling-heating/exhaust-temp-sensor', icon: '/assets/images/category/icons/exhaust-temp-sensor.png'  },
        { id: 'heater-hose', name: 'Heater Hose', url: '/cooling-heating/heater-hose', icon: '/assets/images/category/icons/heater-hose.png' }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: '/assets/images/category/icons/electrical.png',
      isOpen: false,
      subcategories: [
        { id: 'alternator', name: 'Alternator', url: '/electrical/alternator', icon: '/assets/images/category/icons/alternator.png' },
        { id: 'washer-pump', name: 'Washer Pump', url: '/electrical/washer-pump', icon: '/assets/images/category/icons/washer-pump.png' },
        { id: 'starter-motor', name: 'Starter Motor', url: '/electrical/starter-motor', icon: '/assets/images/category/icons/starter-motor.png' },
        { id: 'alternator-pulley', name: 'Alternator Pulley', url: '/electrical/alternator-pulley', icon: '/assets/images/category/icons/alternator-pulley.png' },
        { id: 'relay-flasher', name: 'Relay and Flasher', url: '/electrical/relay-flasher', icon: '/assets/images/category/icons/relay-flasher.png' },
        { id: 'ambient-temp-sensor', name: 'Ambient Temperature Sensor', url: '/electrical/ambient-temp-sensor', icon: '/assets/images/category/icons/ambient-temp-sensor.png' }
      ]
    }
  ];

  currentCategory?: Category;
  
  activeSubcategoryId: string | null = null;
  
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.currentCategory = this.categories.find(cat => cat.id === this.categoryId);
      if (this.currentCategory) {
        this.currentCategory.isOpen = true;
        this.loadProducts();
      }
    });
  }

  toggleCategory(categoryId: string) {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      category.isOpen = !category.isOpen;
    }
  }

  loadProducts() {
    // Simulated product data - replace with actual API call
    this.products = [
      {
        id: '1',
        name: 'Buji Kablosu',
        description: 'BUJİ KABLO SETİ M.BENZ 124 140 210 463 92-00',
        partNumber: 'BREMI-226',
        price: 1249.88,
        inStock: true,
        url: '/product/bremi-226-buji-kablo-seti',
        image: 'https://bcdn.aloparca.com/yedek-parca-resimleri/47…d3c41798b5c72513b13d9030cef0f50a85.webp?width=366',
        brand: 'BREMI',
        brandSlug: 'bremi',
        brandLogo: 'https://bcdn.aloparca.com/Brand_logos/47.jpg',
        specifications: [
          { label: 'Buji', value: 'SAE bağlantı modeli' },
          { label: 'Ateşleme bobini', value: 'M4 bağlantı modeli' },
          { label: 'Bağlantıların sayısı', value: '3' },
          { label: 'Şanzıman numarası', value: '000458; 000458-; 002209' }
        ]
      },
      {
        id: '1',
        name: 'Buji Kablosu',
        description: 'BUJİ KABLO SETİ M.BENZ 124 140 210 463 92-00',
        partNumber: 'BREMI-226',
        price: 1249.88,
        inStock: true,
        url: '/product/bremi-226-buji-kablo-seti',
        image: 'https://bcdn.aloparca.com/products/image.jpg',
        brand: 'BREMI',
        brandSlug: 'bremi',
        brandLogo: 'https://bcdn.aloparca.com/Brand_logos/47.jpg',
        specifications: [
          { label: 'Buji', value: 'SAE bağlantı modeli' },
          { label: 'Ateşleme bobini', value: 'M4 bağlantı modeli' },
          { label: 'Bağlantıların sayısı', value: '3' },
          { label: 'Şanzıman numarası', value: '000458; 000458-; 002209' }
        ]
      },
      // Add more products
    ];
    this.loading = false;
    this.applyFiltersAndSort();
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value as SortOption;
    this.applyFiltersAndSort();
  }

  onFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterBy = select.value as FilterOption;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort() {
    // First apply filters
    this.filteredProducts = this.products.filter(product => {
      if (this.filterBy === 'in_stock') return product.inStock;
      if (this.filterBy === 'out_stock') return !product.inStock;
      return true;
    });

    // Then sort
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  // Helper method to format price
  formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  }

  // Helper methods
  decreaseQuantity(productId: string) {
    // Implement quantity decrease logic
  }

  increaseQuantity(productId: string) {
    // Implement quantity increase logic
  }

  addToCart(productId: string) {
    // Implement add to cart logic
  }
}