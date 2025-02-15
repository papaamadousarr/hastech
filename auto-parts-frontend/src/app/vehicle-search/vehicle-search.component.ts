// vehicle-search.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, VehicleModel } from '../services/product.service';
import { Input } from '@angular/core';

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
export class VehicleSearchComponent implements OnInit {
  @Output() searchComplete = new EventEmitter<any>();
  @Input() isDialog = false;

  selectedBrand: string = '';
  selectedModel: string = '';
  selectedEngine: string = '';

  brands: Brand[] = [
    { id: 'TOYOTA', name: 'TOYOTA', logo: 'assets/images/vehicle_brand/toyota.svg' },
    { id: 'BMW', name: 'BMW', logo: 'assets/images/vehicle_brand/bmw.svg' },
    { id: 'CITROEN', name: 'CITROËN', logo: 'assets/images/vehicle_brand/citroen.svg' },
    { id: 'KIA', name: 'KIA', logo: 'assets/images/vehicle_brand/kia.svg' },
    { id: 'FORD', name: 'FORD', logo: 'assets/images/vehicle_brand/ford.svg' },
    { id: 'HYUNDAI', name: 'HYUNDAI', logo: 'assets/images/vehicle_brand/hyundai.svg' },
    { id: 'MERCEDES', name: 'MERCEDES-BENZ', logo: 'assets/images/vehicle_brand/mercedes.svg' },
    { id: 'MAZDA', name: 'MAZDA', logo: 'assets/images/vehicle_brand/mazda.svg' },
    { id: 'PEUGEOT', name: 'PEUGEOT', logo: 'assets/images/vehicle_brand/peugeot.svg' },
    { id: 'RENAULT', name: 'RENAULT', logo: 'assets/images/vehicle_brand/renault.svg' },
    { id: 'VOLKSWAGEN', name: 'VOLKSWAGEN', logo: 'assets/images/vehicle_brand/volkswagen.svg' }
  ];

  modelsByBrand: { [key: string]: Model[] } = {
    'TOYOTA': [
      { id: 'CAMRY', name: 'Camry', years: '2018-2024' },
      { id: 'COROLLA', name: 'Corolla', years: '2019-2024' },
      { id: 'RAV4', name: 'RAV4', years: '2019-2024' },
      { id: 'YARIS', name: 'Yaris', years: '2020-2024' },
      { id: 'HIGHLANDER', name: 'Highlander', years: '2020-2024' },
      { id: 'CHR', name: 'C-HR', years: '2017-2024' },
      { id: 'LAND_CRUISER', name: 'Land Cruiser', years: '2015-2024' }
    ],
    'BMW': [
      { id: '1_SERIES', name: '1 Series', years: '2019-2024' },
      { id: '2_SERIES', name: '2 Series', years: '2019-2024' },
      { id: '3_SERIES', name: '3 Series', years: '2018-2024' },
      { id: '4_SERIES', name: '4 Series', years: '2020-2024' },
      { id: '5_SERIES', name: '5 Series', years: '2017-2024' },
      { id: '7_SERIES', name: '7 Series', years: '2015-2024' },
      { id: 'X1', name: 'X1', years: '2019-2024' },
      { id: 'X3', name: 'X3', years: '2018-2024' },
      { id: 'X5', name: 'X5', years: '2019-2024' },
      { id: 'X7', name: 'X7', years: '2019-2024' }
    ],
    'CITROEN': [
      { id: 'C3', name: 'C3', years: '2016-2024' },
      { id: 'C4', name: 'C4', years: '2020-2024' },
      { id: 'C5', name: 'C5', years: '2018-2024' },
      { id: 'BERLINGO', name: 'Berlingo', years: '2018-2024' },
      { id: 'C3_AIRCROSS', name: 'C3 Aircross', years: '2017-2024' },
      { id: 'C5_AIRCROSS', name: 'C5 Aircross', years: '2018-2024' }
    ],
    'KIA': [
      { id: 'SPORTAGE', name: 'Sportage', years: '2016-2024' },
      { id: 'CEED', name: 'Ceed', years: '2018-2024' },
      { id: 'RIO', name: 'Rio', years: '2017-2024' },
      { id: 'PICANTO', name: 'Picanto', years: '2017-2024' },
      { id: 'SORENTO', name: 'Sorento', years: '2015-2024' },
      { id: 'STONIC', name: 'Stonic', years: '2017-2024' },
      { id: 'NIRO', name: 'Niro', years: '2016-2024' }
    ],
    'FORD': [
      { id: 'FIESTA', name: 'Fiesta', years: '2017-2024' },
      { id: 'FOCUS', name: 'Focus', years: '2018-2024' },
      { id: 'KUGA', name: 'Kuga', years: '2019-2024' },
      { id: 'PUMA', name: 'Puma', years: '2019-2024' },
      { id: 'MONDEO', name: 'Mondeo', years: '2015-2024' },
      { id: 'ECOSPORT', name: 'EcoSport', years: '2017-2024' },
      { id: 'TRANSIT', name: 'Transit', years: '2014-2024' }
    ],
    'HYUNDAI': [
      { id: 'I20', name: 'i20', years: '2020-2024' },
      { id: 'I30', name: 'i30', years: '2017-2024' },
      { id: 'TUCSON', name: 'Tucson', years: '2015-2024' },
      { id: 'KONA', name: 'Kona', years: '2017-2024' },
      { id: 'SANTA_FE', name: 'Santa Fe', years: '2018-2024' },
      { id: 'BAYON', name: 'Bayon', years: '2021-2024' }
    ],
    'MERCEDES': [
      { id: 'A_CLASS', name: 'A-Class', years: '2018-2024' },
      { id: 'B_CLASS', name: 'B-Class', years: '2019-2024' },
      { id: 'C_CLASS', name: 'C-Class', years: '2014-2024' },
      { id: 'E_CLASS', name: 'E-Class', years: '2016-2024' },
      { id: 'GLA', name: 'GLA', years: '2020-2024' },
      { id: 'GLB', name: 'GLB', years: '2019-2024' },
      { id: 'GLC', name: 'GLC', years: '2015-2024' },
      { id: 'GLE', name: 'GLE', years: '2019-2024' }
    ],
    'MAZDA': [
      { id: 'MAZDA2', name: 'Mazda2', years: '2015-2024' },
      { id: 'MAZDA3', name: 'Mazda3', years: '2019-2024' },
      { id: 'MAZDA6', name: 'Mazda6', years: '2018-2024' },
      { id: 'CX3', name: 'CX-3', years: '2015-2024' },
      { id: 'CX30', name: 'CX-30', years: '2019-2024' },
      { id: 'CX5', name: 'CX-5', years: '2017-2024' }
    ],
    'PEUGEOT': [
      { id: '208', name: '208', years: '2019-2024' },
      { id: '2008', name: '2008', years: '2019-2024' },
      { id: '308', name: '308', years: '2021-2024' },
      { id: '3008', name: '3008', years: '2016-2024' },
      { id: '5008', name: '5008', years: '2017-2024' },
      { id: 'PARTNER', name: 'Partner', years: '2018-2024' }
    ],
    'RENAULT': [
      { id: 'CLIO', name: 'Clio', years: '2019-2024' },
      { id: 'CAPTUR', name: 'Captur', years: '2019-2024' },
      { id: 'MEGANE', name: 'Megane', years: '2016-2024' },
      { id: 'KADJAR', name: 'Kadjar', years: '2015-2024' },
      { id: 'SCENIC', name: 'Scenic', years: '2016-2024' },
      { id: 'ARKANA', name: 'Arkana', years: '2021-2024' }
    ],
    'VOLKSWAGEN': [
      { id: 'POLO', name: 'Polo', years: '2017-2024' },
      { id: 'GOLF', name: 'Golf', years: '2019-2024' },
      { id: 'TIGUAN', name: 'Tiguan', years: '2016-2024' },
      { id: 'PASSAT', name: 'Passat', years: '2015-2024' },
      { id: 'TCROSS', name: 'T-Cross', years: '2019-2024' },
      { id: 'TROC', name: 'T-Roc', years: '2017-2024' },
      { id: 'TOURAN', name: 'Touran', years: '2015-2024' }
    ]
  };

  enginesByModel: { [key: string]: VehicleEngine[] } = {
    '3_SERIES': [
      { id: '318i', name: '2.0L Turbo (318i)', power: '156 HP' },
      { id: '320i', name: '2.0L Turbo (320i)', power: '184 HP' },
      { id: '330i', name: '2.0L Turbo (330i)', power: '258 HP' },
      { id: 'M340i', name: '3.0L Turbo (M340i)', power: '374 HP' },
      { id: '320d', name: '2.0L Diesel (320d)', power: '190 HP' },
      { id: '330d', name: '3.0L Diesel (330d)', power: '286 HP' }
    ],
    'C_CLASS': [
      { id: 'C180', name: '1.6L Turbo (C180)', power: '156 HP' },
      { id: 'C200', name: '2.0L Turbo (C200)', power: '184 HP' },
      { id: 'C300', name: '2.0L Turbo (C300)', power: '258 HP' },
      { id: 'C220d', name: '2.0L Diesel (C220d)', power: '194 HP' },
      { id: 'C300d', name: '2.0L Diesel (C300d)', power: '245 HP' },
      { id: 'C43_AMG', name: '3.0L Turbo (C43 AMG)', power: '390 HP' }
    ],
    'GOLF': [
      { id: 'GOLF_10TSI', name: '1.0L TSI', power: '110 HP' },
      { id: 'GOLF_15TSI', name: '1.5L TSI', power: '130 HP' },
      { id: 'GOLF_15TSI_EVO', name: '1.5L TSI EVO', power: '150 HP' },
      { id: 'GOLF_20TDI', name: '2.0L TDI', power: '115 HP' },
      { id: 'GOLF_20TDI_150', name: '2.0L TDI', power: '150 HP' },
      { id: 'GOLF_GTI', name: '2.0L TSI (GTI)', power: '245 HP' }
    ],
    'COROLLA': [
      { id: 'COROLLA_16', name: '1.6L Dynamic Force', power: '132 HP' },
      { id: 'COROLLA_18H', name: '1.8L Hybrid', power: '122 HP' },
      { id: 'COROLLA_20H', name: '2.0L Hybrid', power: '184 HP' }
    ],
    'CLIO': [
      { id: 'CLIO_10TCE', name: '1.0L TCe', power: '90 HP' },
      { id: 'CLIO_10TCE_100', name: '1.0L TCe', power: '100 HP' },
      { id: 'CLIO_13TCE', name: '1.3L TCe', power: '130 HP' },
      { id: 'CLIO_15DCI', name: '1.5L dCi', power: '85 HP' },
      { id: 'CLIO_15DCI_115', name: '1.5L dCi', power: '115 HP' }
    ],
    '308': [
      { id: '308_13PTECH', name: '1.3L PureTech', power: '130 HP' },
      { id: '308_15PTECH', name: '1.5L PureTech', power: '130 HP' },
      { id: '308_16PTECH', name: '1.6L PureTech', power: '180 HP' },
      { id: '308_15BLUEHDI', name: '1.5L BlueHDi', power: '130 HP' },
      { id: '308_20BLUEHDI', name: '2.0L BlueHDi', power: '180 HP' }
    ]
  };

  models: Model[] = [];
  engines: VehicleEngine[] = [];

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Initialize any required data
  }

  onBrandSelect() {
    this.selectedModel = '';
    this.selectedEngine = '';
    this.engines = [];
    
    if (this.selectedBrand) {
      this.models = this.modelsByBrand[this.selectedBrand] || [];
    }
  }

  onModelSelect() {
    this.selectedEngine = '';
    
    if (this.selectedModel) {
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